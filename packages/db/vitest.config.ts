import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // include + all: count every source file (e.g. the index.ts barrel)
      // instead of only the files tests happened to load.
      include: ['src/**/*.ts'],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
