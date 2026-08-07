import { describe, it, expect } from 'vitest'
import { GET, POST } from './route'

describe('GET /api/hello', () => {
  it('returns the hello message from Hono', async () => {
    const req = new Request('http://localhost/api/hello')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { message: string }
    expect(body.message).toBe('Hello from Hono!')
  })
})

describe('POST /api/hello', () => {
  it('greets a named person', async () => {
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { message: string }
    expect(body.message).toBe('Hello, Alice!')
  })

  it('falls back to the generic greeting without a name', async () => {
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { message: string }
    expect(body.message).toBe('Hello from Hono!')
  })

  it('rejects invalid JSON gracefully', async () => {
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { message: string }
    expect(body.message).toBe('Hello from Hono!')
  })
})
