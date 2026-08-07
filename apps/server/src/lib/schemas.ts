import { z } from 'zod'

/**
 * Cap prompt length to bound token cost / abuse. 10k chars is a generous demo
 * ceiling — tune via your own requirements.
 */
export const MAX_PROMPT_LENGTH = 10_000

/**
 * Request body schema for `POST /api/chat`. Centralised here so the route
 * handler and any future tests share one definition of "valid".
 */
export const chatSchema = z.object({
  // trim() so whitespace-only prompts ("   ") are rejected instead of being
  // sent to the model as a (wasted) empty call.
  prompt: z.string().trim().min(1).max(MAX_PROMPT_LENGTH),
})
