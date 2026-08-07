import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react'
import { api } from '../lib/query'
import { useCounter } from '../lib/store'

type Status = { status: string; time: string }

const schema = z.object({
  message: z.string().min(2, 'Enter at least 2 characters'),
})
type Values = z.infer<typeof schema>

export default function HomePage() {
  const { count, increment, reset } = useCounter()
  const { data, isLoading, error } = useQuery<Status>({
    queryKey: ['health'],
    queryFn: () => api.get('').json<Status>(),
  })

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = (values: Values) => {
    toast.success(`Sent: "${values.message}"`)
    resetForm()
  }

  return (
    <div className="flex flex-col gap-16">
      {/* ── Hero ── */}
      <section className="flex flex-col gap-5">
        <div className="relative w-fit">
          <img
            src="/favicon.png"
            alt=""
            aria-hidden
            width="72"
            height="72"
            className="size-[72px] rounded-xl"
          />
          <div
            className="seal-pop absolute -right-3 -bottom-3 flex size-9 items-center justify-center rounded-md text-base font-bold text-white shadow-lg"
            style={{
              background: 'var(--vermilion)',
              transform: 'rotate(-10deg)',
            }}
            aria-hidden
          >
            <span className="font-display">S</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: 'var(--vermilion)' }}
          >
            01 — The Desktop Surface
          </p>
          <h1 className="font-display text-5xl font-light leading-[0.98] tracking-[-0.02em]">
            One repo.
            <br />
            <span style={{ color: 'var(--vermilion)' }} className="italic">
              Every surface.
            </span>
          </h1>
          <p
            className="max-w-md text-base leading-relaxed"
            style={{ color: 'var(--graphite)' }}
          >
            Startup, a desktop starter from{' '}
            <a
              href="https://erlinerd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--ink)' }}
            >
              erlinerd
            </a>
            . This app and the marketing site share one design system and one
            codebase — everything below is wired up and ready to build on.
          </p>
        </div>
      </section>

      {/* ── Demo grid: three wired-up building blocks ── */}
      <section className="flex flex-col gap-4">
        <p
          className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color: 'var(--graphite)' }}
        >
          02 — Wired Up
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Zustand counter */}
          <article
            className="flex flex-col gap-3 rounded-xl p-5"
            style={{
              background: 'oklch(1 0 0)',
              border: '1px solid var(--rule)',
            }}
          >
            <h2 className="font-display text-sm font-medium">Zustand</h2>
            <p className="text-xs" style={{ color: 'var(--graphite)' }}>
              Local state, no boilerplate.
            </p>
            <div className="mt-auto flex items-center gap-2 pt-2">
              <button
                onClick={increment}
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'var(--ink)' }}
              >
                Count is {count}
              </button>
              <button
                onClick={reset}
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition-opacity hover:opacity-70"
                style={{
                  color: 'var(--ink)',
                  border: '1px solid var(--rule)',
                }}
              >
                Reset
              </button>
            </div>
          </article>

          {/* TanStack Query */}
          <article
            className="flex flex-col gap-3 rounded-xl p-5"
            style={{
              background: 'oklch(1 0 0)',
              border: '1px solid var(--rule)',
            }}
          >
            <h2 className="font-display text-sm font-medium">TanStack Query</h2>
            <p className="text-xs" style={{ color: 'var(--graphite)' }}>
              Fetches <code className="font-mono">GET /</code> from the server.
            </p>
            <div className="mt-auto pt-2">
              {isLoading ? (
                <p className="text-xs" style={{ color: 'var(--graphite)' }}>
                  Loading…
                </p>
              ) : error ? (
                error instanceof Error &&
                (error.name === 'TypeError' ||
                  error.message.includes('fetch')) ? (
                  <p className="text-xs" style={{ color: 'var(--graphite)' }}>
                    Server unreachable (start it with{' '}
                    <code className="font-mono">pnpm dev --filter server</code>
                    ).
                  </p>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--graphite)' }}>
                    Server error:{' '}
                    <code className="font-mono">{error.message}</code>
                  </p>
                )
              ) : (
                <pre
                  className="overflow-x-auto rounded-md p-2 font-mono text-[0.7rem]"
                  style={{ background: 'var(--paper)' }}
                >
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          </article>
        </div>

        {/* react-hook-form + zod (full width) */}
        <article
          className="flex flex-col gap-3 rounded-xl p-5"
          style={{
            background: 'oklch(1 0 0)',
            border: '1px solid var(--rule)',
          }}
        >
          <h2 className="font-display text-sm font-medium">
            react-hook-form + zod
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 sm:flex-row sm:items-start"
            noValidate
          >
            <div className="flex-1">
              <input
                {...register('message')}
                placeholder="Type a message"
                aria-label="Message"
                className="h-10 w-full rounded-md px-3 text-sm outline-none focus-visible:ring-2"
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--rule)',
                  // @ts-expect-error -- CSS custom prop via React style
                  '--tw-ring-color': 'var(--vermilion)',
                }}
              />
              {errors.message ? (
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: 'var(--vermilion)' }}
                >
                  {errors.message.message}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-1 self-start rounded-md px-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:self-auto"
              style={{ background: 'var(--ink)' }}
            >
              Send toast
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </form>
        </article>
      </section>
    </div>
  )
}
