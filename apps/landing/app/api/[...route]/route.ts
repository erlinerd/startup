import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

// POST /api/hello — personalized greeting, e.g. { "name": "Alice" } →
// { "message": "Hello, Alice!" }. `name` is optional and falls back to
// the generic greeting.
app.post('/hello', async (c) => {
  const body = await c.req.json().catch(() => null)
  const name = body?.name
  if (typeof name === 'string' && name.trim().length > 0) {
    return c.json({ message: `Hello, ${name.trim()}!` })
  }
  return c.json({ message: 'Hello from Hono!' })
})

export const GET = handle(app)
export const POST = handle(app)
