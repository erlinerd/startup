import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { users } from '@repo/db'
import { createAppEnv, type AppEnv } from './env'
import { getDb } from './lib/db'
import { chat } from './lib/ai'
import { chatSchema, MAX_PROMPT_LENGTH } from './lib/schemas'

/**
 * Request bindings. On Node there are no platform bindings; `c.env` is used
 * only as a per-request override channel by tests (Hono's `app.request(url,
 * init, Bindings)` third arg). Production reads `process.env` instead.
 */
type Bindings = {
  DATABASE_URL?: string
  DATABASE_AUTH_TOKEN?: string
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  SKIP_ENV_VALIDATION?: string
  // Allowlist of origins permitted to call this API (comma-separated).
  // Defaults to permissive in dev; set CORS_ORIGINS in production.
  CORS_ORIGINS?: string
}

const app = new Hono<{ Bindings: Bindings; Variables: { env: AppEnv } }>()

app.use('*', logger())

// CORS: web apps and the Electron renderer (origin `null` under file://)
// otherwise can't read responses. The allowlist is read from the merged
// `{ ...process.env, ...c.env }` — same semantics as the env middleware below.
// In production @hono/node-server never passes CORS_ORIGINS in `c.env` (it only
// carries {incoming, outgoing}), so process.env is the real source there;
// tests inject bindings via `app.request()`'s third arg.
//
// The dev defaults (any localhost + Electron `null`) apply ONLY when no
// CORS_ORIGINS is configured. Setting the allowlist in production locks the
// API down — localhost/null are not implicitly allowed once it's set.
app.use('*', (c, next) =>
  cors({
    origin: (origin) => {
      const merged = { ...process.env, ...c.env }
      const allowed = (merged.CORS_ORIGINS ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
      const devDefaults =
        origin === 'null' || /^http:\/\/localhost(:\d+)?$/.test(origin)
      // Under file:// the renderer sends the literal string "null".
      // (hono always passes a string here — empty string when no Origin header.)
      if (allowed.includes(origin) || (allowed.length === 0 && devDefaults)) {
        // Echo the request origin back (avoids "*" with credentials).
        return origin
      }
      return null
    },
  })(c, next),
)

// Resolve & validate env per-request. In production `c.env` is empty on Node,
// so we fall back to process.env; tests inject bindings via the third argument
// to `app.request()`, which overrides process.env.
app.use('*', async (c, next) => {
  const env = createAppEnv({ ...process.env, ...c.env })
  c.set('env', env)
  await next()
})

app.get('/', (c) => c.json({ status: 'ok', time: new Date().toISOString() }))

app.get('/users', async (c) => {
  const env = c.get('env')
  const db = getDb(env)
  if (!db) {
    return c.json({ error: 'DATABASE_URL is not configured' }, 503)
  }
  try {
    const rows = await db.select().from(users).limit(100).all()
    return c.json({ users: rows })
  } catch (err) {
    // oxlint-disable-next-line no-console -- console is the log channel
    console.error('[users] query failed:', err)
    return c.json({ error: 'database query failed' }, 500)
  }
})

app.post('/api/chat', async (c) => {
  const env = c.get('env')
  if (!env.OPENAI_API_KEY) {
    return c.json({ error: 'OPENAI_API_KEY is not configured' }, 503)
  }

  const body = await c.req.json().catch(() => null)
  const parsed = chatSchema.safeParse(body)
  if (!parsed.success) {
    const prompt = body?.prompt
    const issue = parsed.error.issues[0]
    const code = issue?.code
    if (code === 'too_small') {
      return c.json({ error: 'prompt is required' }, 400)
    }
    if (code === 'too_big' && prompt) {
      return c.json(
        { error: `prompt must be at most ${MAX_PROMPT_LENGTH} chars` },
        413,
      )
    }
    // Malformed body / non-string prompt.
    return c.json({ error: 'prompt is required' }, 400)
  }

  const { prompt } = parsed.data
  try {
    const result = chat(env, { prompt })
    return result.toTextStreamResponse()
  } catch (err) {
    // oxlint-disable-next-line no-console -- console is the log channel
    console.error('[chat] failed to start stream:', err)
    return c.json({ error: 'failed to start chat stream' }, 500)
  }
})

// Only start the HTTP listener when this file is run directly (not when
// imported by tests). `import.meta.main` is the Node ESM equivalent of
// `require.main === module`.
if (import.meta.main) {
  // All env keys are optional so tests/CI run with zero secrets; in production
  // a missing key degrades to a per-route 503. Warn loudly at startup instead
  // of discovering the gap at request time. Doesn't abort — routes stay up.
  if (process.env.NODE_ENV === 'production') {
    for (const key of ['DATABASE_URL', 'OPENAI_API_KEY'] as const) {
      if (!process.env[key]) {
        // oxlint-disable-next-line no-console -- startup warning
        console.warn(`[env] ${key} is not set — routes that need it will 503`)
      }
    }
  }

  const port = Number(process.env.PORT) || 15200
  serve({ fetch: app.fetch, port }, (info) => {
    // oxlint-disable-next-line no-console -- startup banner
    console.log(`Server is running on http://localhost:${info.port}`)
  })
}

export default app
