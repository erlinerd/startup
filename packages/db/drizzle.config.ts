import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  // drizzle-kit only needs this for `db:push` / `db:studio` against a live DB.
  // `db:generate` is schema-only and ignores it.
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? ':memory:',
  },
})
