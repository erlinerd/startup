import { describe, it, expect } from 'vitest'
import app from './index'

// Hono's app.request(url, init, env) lets us inject bindings per test, so no
// real DATABASE_URL / OPENAI_API_KEY is needed. The env middleware merges
// { ...process.env, ...c.env }, so these bindings override process.env.

describe('GET /', () => {
  it('returns ok status', async () => {
    const res = await app.request('/', {}, {})
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ status: 'ok', time: expect.any(String) })
  })

  it('returns a valid ISO timestamp', async () => {
    const res = await app.request('/', {}, {})
    const body = (await res.json()) as { time: string }
    expect(() => new Date(body.time).toISOString()).not.toThrow()
  })
})

describe('GET /users', () => {
  it('returns 503 when DATABASE_URL is not configured', async () => {
    const res = await app.request('/users', {}, {})
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toEqual({ error: 'DATABASE_URL is not configured' })
  })

  it('does not return 503 when DATABASE_URL is :memory:', async () => {
    // The migrations are NOT run server-side (they live in packages/db), so
    // the table doesn't exist here: the query fails with 500 (no such table),
    // which still proves the request got past the not-configured guard.
    // Full insert/read coverage is in packages/db.
    const res = await app.request('/users', {}, { DATABASE_URL: ':memory:' })
    expect(res.status).toBe(500)
  })
})

describe('POST /api/chat', () => {
  it('returns 503 when OPENAI_API_KEY is not configured', async () => {
    const res = await app.request(
      '/api/chat',
      { method: 'POST', body: JSON.stringify({ prompt: 'hi' }) },
      {},
    )
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toEqual({ error: 'OPENAI_API_KEY is not configured' })
  })

  it('returns 400 when prompt is missing', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'prompt is required' })
  })

  it('returns 400 when body is not JSON', async () => {
    const res = await app.request(
      '/api/chat',
      { method: 'POST', body: 'not json' },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when prompt is an empty string', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({ prompt: '' }),
        headers: { 'Content-Type': 'application/json' },
      },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when prompt is whitespace only', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({ prompt: '   ' }),
        headers: { 'Content-Type': 'application/json' },
      },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when prompt is not a string', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({ prompt: 123 }),
        headers: { 'Content-Type': 'application/json' },
      },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(400)
  })

  it('returns 413 when prompt exceeds the length cap', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({ prompt: 'a'.repeat(10_001) }),
        headers: { 'Content-Type': 'application/json' },
      },
      { OPENAI_API_KEY: 'sk-fake' },
    )
    expect(res.status).toBe(413)
  })

  describe('happy path', () => {
    it('streams a completion when OPENAI_API_KEY is set', async () => {
      // streamText().toTextStreamResponse() returns a Response whose body is a
      // ReadableStream. We don't decode it (no real network call is wanted);
      // asserting status 200 confirms the stream handler was reached rather
      // than the not-configured guard.
      const res = await app.request(
        '/api/chat',
        {
          method: 'POST',
          body: JSON.stringify({ prompt: 'hi' }),
          headers: { 'Content-Type': 'application/json' },
        },
        { OPENAI_API_KEY: 'sk-fake' },
      )
      expect(res.status).toBe(200)
    })
  })
})

describe('CORS', () => {
  it('reflects localhost origins in Access-Control-Allow-Origin', async () => {
    const res = await app.request(
      '/',
      { headers: { Origin: 'http://localhost:15000' } },
      {},
    )
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:15000',
    )
  })

  it('reflects the Electron null origin', async () => {
    // file:// renderers send the literal string "null"; our dev allowlist
    // passes it through by echoing it back.
    const res = await app.request('/', { headers: { Origin: 'null' } }, {})
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('null')
  })

  it('blocks disallowed origins', async () => {
    const res = await app.request(
      '/',
      { headers: { Origin: 'https://evil.example' } },
      {},
    )
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })

  it('reflects an origin on the CORS_ORIGINS allowlist (via bindings)', async () => {
    // Custom allowlist injected via Hono bindings — the test-injection channel.
    const res = await app.request(
      '/',
      { headers: { Origin: 'https://example.com' } },
      { CORS_ORIGINS: 'https://example.com' },
    )
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'https://example.com',
    )
  })

  it('reflects an origin on the CORS_ORIGINS allowlist (via process.env)', async () => {
    // Production channel: @hono/node-server never puts CORS_ORIGINS in the
    // bindings, so the allowlist must also come from process.env.
    const prev = process.env.CORS_ORIGINS
    process.env.CORS_ORIGINS = 'https://prod.example'
    try {
      const res = await app.request(
        '/',
        { headers: { Origin: 'https://prod.example' } },
        {},
      )
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
        'https://prod.example',
      )
    } finally {
      if (prev === undefined) delete process.env.CORS_ORIGINS
      else process.env.CORS_ORIGINS = prev
    }
  })

  it('blocks an origin outside the CORS_ORIGINS allowlist', async () => {
    const res = await app.request(
      '/',
      { headers: { Origin: 'https://evil.example' } },
      { CORS_ORIGINS: 'https://example.com' },
    )
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })

  it('blocks localhost when an explicit allowlist is configured', async () => {
    // Setting CORS_ORIGINS must lock the API down — the dev defaults
    // (localhost + `null`) only apply when no allowlist is configured.
    const res = await app.request(
      '/',
      { headers: { Origin: 'http://localhost:15000' } },
      { CORS_ORIGINS: 'https://example.com' },
    )
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})

describe('CORS preflight', () => {
  it('answers OPTIONS with the allow headers', async () => {
    const res = await app.request(
      '/api/chat',
      {
        method: 'OPTIONS',
        headers: { Origin: 'http://localhost:15000' },
      },
      {},
    )
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:15000',
    )
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST')
  })
})
