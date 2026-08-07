import { describe, it, expect } from 'vitest'
import { createClient } from '@libsql/client'
import { createInsertSchema } from 'drizzle-zod'
import { migrate } from 'drizzle-orm/libsql/migrator'
import path from 'node:path'
import { users } from './schema'
import { createDb } from './client'

/**
 * Build an in-memory database and run the generated migrations against it.
 * No network, no real credentials, no native binaries.
 */
async function makeDb() {
  const client = createClient({ url: ':memory:' })
  const db = createDb(client)
  await migrate(db, {
    migrationsFolder: path.resolve(import.meta.dirname, '../migrations'),
  })
  return db
}

describe('users schema', () => {
  it('inserts and reads back a row', async () => {
    const db = await makeDb()
    await db.insert(users).values({
      name: 'Ada',
      email: 'ada@example.com',
    })

    const rows = await db.select().from(users).all()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.name).toBe('Ada')
    expect(rows[0]?.email).toBe('ada@example.com')
    expect(rows[0]?.createdAt).toBeInstanceOf(Date)
  })

  it('generates a zod schema from drizzle-zod', () => {
    const insertSchema = createInsertSchema(users)
    const parsed = insertSchema.parse({
      name: 'Grace',
      email: 'grace@example.com',
    })
    expect(parsed.name).toBe('Grace')
    expect(parsed.email).toBe('grace@example.com')
  })
})
