import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * Environment factory.
 *
 * t3-env validates eagerly inside `createEnv()`, so we wrap it in a function:
 * importing this module never triggers validation — only calling
 * `createAppEnv(runtimeEnv)` does. The caller passes the resolved runtime env
 * (production reads `process.env`; tests inject a mock), so the factory itself
 * never reaches for a global, keeping it side-effect-free.
 *
 * All keys are optional: the server builds and its unit tests run with no
 * credentials. Routes that need a key (e.g. /api/chat) check at request time.
 *
 * `skipValidation` is derived from the passed-in runtimeEnv (not `process.env`)
 * so callers opt out explicitly — e.g. tests pass `{ SKIP_ENV_VALIDATION: '1' }`.
 */
export type AppEnv = ReturnType<typeof createAppEnv>

export function createAppEnv(runtimeEnv: Record<string, string | undefined>) {
  return createEnv({
    server: {
      DATABASE_URL: z.string().min(1).optional(),
      DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
      OPENAI_API_KEY: z.string().min(1).optional(),
      OPENAI_MODEL: z.string().min(1).default('gpt-4o'),
      // Allowlist of origins permitted to call this API (comma-separated).
      // Defaults to permissive in dev (localhost + Electron `null`); set in prod.
      CORS_ORIGINS: z.string().optional(),
      // Allow callers (CI, tests) to bypass validation without real secrets.
      SKIP_ENV_VALIDATION: z.string().optional(),
    },
    skipValidation: runtimeEnv['SKIP_ENV_VALIDATION'] === '1',
    emptyStringAsUndefined: true,
    runtimeEnv,
  })
}
