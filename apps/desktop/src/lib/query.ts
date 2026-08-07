import { QueryClient } from '@tanstack/react-query'
import ky from 'ky'

// Default to the local server. Override with VITE_SERVER_URL for a remote API.
export const serverBaseUrl =
  import.meta.env['VITE_SERVER_URL'] ?? 'http://localhost:15200/'

export const api = ky.create({
  baseUrl: serverBaseUrl,
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})
