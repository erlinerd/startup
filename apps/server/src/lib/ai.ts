import { streamText, type StreamTextOnErrorCallback } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import type { AppEnv } from '../env'

export interface ChatOptions {
  prompt: string
}

// Capture stream-internal errors (e.g. OpenAI auth/rate-limit failures that
// surface mid-stream) so they're observable instead of silently truncating the
// text stream the client receives.
const handleStreamError: StreamTextOnErrorCallback = ({ error }) => {
  // oxlint-disable-next-line no-console -- console is the log channel
  console.error('[chat] stream error:', error)
}

/**
 * Streams a model completion. The caller must ensure OPENAI_API_KEY is present
 * (routes check before calling). Returns the streamText result so the handler
 * can convert it to a Response.
 */
export function chat(env: AppEnv, { prompt }: ChatOptions) {
  const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  })

  return streamText({
    model: openai(env.OPENAI_MODEL),
    prompt,
    onError: handleStreamError,
  })
}
