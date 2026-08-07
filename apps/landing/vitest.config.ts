import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // NOTE: `all: true` + broad include is deliberately NOT set here. Vitest's
    // rolldown coverage collector fails to parse the landing TSX files
    // (app/page.tsx, app/layout.tsx — "Expected `from`..."), excluding them from
    // the report anyway, so a full-source number would be illusory. Only the
    // API route is tested today; the report honestly reflects that. Add
    // include+all (and raise thresholds) once page.tsx/layout.tsx have tests.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    setupFiles: ['./test-setup.ts'],
  },
})
