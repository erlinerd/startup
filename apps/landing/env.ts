import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Server-only keys (e.g. a backend API token). Add real keys here as needed.
  },
  client: {
    // Exposed to the browser. Must be prefixed with NEXT_PUBLIC_.
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Startup'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
