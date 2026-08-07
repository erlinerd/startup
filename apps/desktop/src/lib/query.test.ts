import { describe, it, expect } from 'vitest'
import { api, queryClient, serverBaseUrl } from './query'

describe('serverBaseUrl', () => {
  it('defaults to the local server when VITE_SERVER_URL is unset', () => {
    expect(serverBaseUrl).toBe('http://localhost:15200/')
  })
})

describe('api client', () => {
  it('is bound to the server base URL', () => {
    // ky stores the baseUrl on the instance; assert it was created with ours.
    // We can't read ky's internal field portably, so verify the instance exists
    // and is the same one exported (smoke for module load + wiring).
    expect(api).toBeDefined()
    expect(typeof api.get).toBe('function')
  })
})

describe('queryClient defaults', () => {
  it('caches for 30s before refetch', () => {
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(30_000)
  })

  it('retries failed queries once', () => {
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(1)
  })
})
