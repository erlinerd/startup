// oxlint-disable-next-line import/no-unassigned-import -- jest-dom matchers side effect
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount between tests so `screen` (a global DOM) doesn't accumulate across cases.
afterEach(() => {
  cleanup()
})
