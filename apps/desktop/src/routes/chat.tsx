import { useState } from 'react'
import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  ThreadPrimitive,
} from '@assistant-ui/react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'
import { DefaultChatTransport } from 'ai'
import { serverBaseUrl } from '../lib/query'

// The server streams Vercel AI SDK text (POST /api/chat). Use an absolute URL
// so this works in the browser AND under Electron (file:// has no origin, so a
// relative "api/chat" would resolve against file:// and fail).
const CHAT_API = new URL('api/chat', serverBaseUrl).toString()

function Composer() {
  const [draft, setDraft] = useState('')

  return (
    <ComposerPrimitive.Root className="border-border border-t p-3">
      <ComposerPrimitive.Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Ask anything…"
        className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
      />
      <div className="mt-2 flex justify-end">
        <ComposerPrimitive.Send className="bg-primary text-primary-foreground disabled:opacity-50 rounded-md px-4 py-2 text-sm font-medium">
          Send
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  )
}

function Messages() {
  return (
    <ThreadPrimitive.Messages>
      {({ message }) => {
        const isUser = message.role === 'user'
        const text = message.content
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join('')
        return (
          <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                isUser
                  ? 'bg-primary text-primary-foreground max-w-[80%] rounded-lg px-3 py-2 text-sm'
                  : 'bg-muted max-w-[80%] rounded-lg px-3 py-2 text-sm'
              }
            >
              {text || '…'}
            </div>
          </div>
        )
      }}
    </ThreadPrimitive.Messages>
  )
}

export default function ChatPage() {
  const runtime = useChatRuntime({
    transport: new DefaultChatTransport({ api: CHAT_API }),
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="border-border bg-background mx-auto flex h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border">
        <ThreadPrimitive.Root className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <ThreadPrimitive.Viewport className="flex flex-col gap-3">
              <Messages />
            </ThreadPrimitive.Viewport>
          </div>
          <Composer />
        </ThreadPrimitive.Root>
      </div>
    </AssistantRuntimeProvider>
  )
}
