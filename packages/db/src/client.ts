import { drizzle } from 'drizzle-orm/libsql'
import type { Client } from '@libsql/client'
import * as schema from './schema'

/**
 * Create a Drizzle instance bound to an existing LibSQL client.
 *
 * Callers decide how the underlying `@libsql/client` is built:
 *   - tests / local  -> `createClient({ url: ':memory:' })`
 *   - production     -> `createClient({ url: 'libsql://…', authToken })`
 *
 * This keeps the package runtime-agnostic (no `process.env` access here).
 */
export type Database = ReturnType<typeof createDb>

export function createDb(client: Client) {
  return drizzle(client, { schema })
}
