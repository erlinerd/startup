import { createClient } from '@libsql/client'
import { createDb, type Database } from '@repo/db'
import type { AppEnv } from '../env'

// One client per (url, token) pair, memoized. The AppEnv object we build per
// request is fresh each time, so keying on the URL string (not the env object)
// is what actually reuses the connection on a long-lived Node process.
// Including the auth token avoids reusing a client whose credentials were
// rotated.
let cached: { url: string; token?: string; db: Database } | null = null

/**
 * Lazily build a Drizzle instance from the env's database URL.
 * Returns `null` when DATABASE_URL is not configured (e.g. CI, local dev
 * without a DB) so callers can degrade gracefully instead of throwing.
 */
export function getDb(env: AppEnv): Database | null {
  const url = env.DATABASE_URL
  if (!url) return null

  const token = env.DATABASE_AUTH_TOKEN
  if (cached && cached.url === url && cached.token === token) return cached.db

  const client = createClient({
    url,
    authToken: token,
  })
  const db = createDb(client)
  cached = { url, token, db }
  return db
}
