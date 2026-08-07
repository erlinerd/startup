import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Measured 2026-08-07: 82/67/84/82. Branch floor is the binding one —
      // the zod error-code mapping and db cache-miss paths are untested.
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 60,
        statements: 80,
      },
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
