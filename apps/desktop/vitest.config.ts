import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Thresholds are honest full-source numbers: with `include` + `all`,
    // untested files (chat/home/router/App) count against coverage. Measured
    // 2026-08-07: 17.9 lines / 6.5 branches / 22.7 funcs. Only lib/ and the
    // about route are tested today (chat/home need heavy mocking and are
    // deferred) — raise these as coverage lands.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      exclude: ['**/*.d.ts'],
      thresholds: {
        lines: 12,
        functions: 15,
        branches: 3,
        statements: 15,
      },
    },
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
  },
})
