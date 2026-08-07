import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // include + all: only Button and utils are tested today; without this,
      // unloaded files (e.g. card.tsx) are silently excluded and the report
      // reads 100% regardless. These floors are honest full-source numbers
      // (measured 2026-08-07: 41/66/22/41) — raise them as components gain tests.
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      thresholds: {
        lines: 35,
        functions: 15,
        branches: 55,
        statements: 35,
      },
    },
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
  },
})
