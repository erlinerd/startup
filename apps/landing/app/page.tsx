'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react'
import { env } from '../env'

const schema = z.object({
  email: z.email('Enter a valid email'),
})
type Values = z.infer<typeof schema>

export default function Home() {
  // Demo: call the Hono API route mounted at /api/hello (see
  // app/api/[...route]/route.ts) to prove Hono runs inside Next.js.
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data: { message?: string }) => setApiMessage(data.message ?? null))
      .catch(() => setApiMessage(null))
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  })

  // Example submit handler — the waitlist form is a demo.
  const onSubmit = (values: Values) => {
    toast.success(`Welcome aboard! We'll keep you posted at ${values.email}.`)
    reset()
  }

  return (
    <div
      className="landing min-h-svh"
      style={
        {
          // Local refs to the scoped tokens so Tailwind arbitrary values work
          // without enumerating every color in @theme.
          '--paper': 'var(--paper)',
        } as React.CSSProperties
      }
    >
      {/* ── Top bar: mark + wordmark + section label ── */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/icon.png"
            alt=""
            aria-hidden
            width="32"
            height="32"
            className="size-8 rounded-md"
          />
          <span className="font-display text-lg font-medium tracking-tight">
            {env.NEXT_PUBLIC_APP_NAME}
          </span>
        </a>
        <span
          className="text-[0.7rem] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'var(--graphite)' }}
        >
          Monorepo Starter
        </span>
      </header>

      {/* ── Hero: asymmetric editorial split ── */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:pt-20">
        {/* Left: narrative (7 cols) */}
        <section className="flex flex-col justify-center lg:col-span-7">
          <p
            className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: 'var(--vermilion)' }}
          >
            01 — The Thesis
          </p>
          <h1 className="font-display text-[3.25rem] font-light leading-[0.98] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]">
            Ship every
            <br />
            surface.
            <br />
            <span style={{ color: 'var(--vermilion)' }} className="italic">
              One repo.
            </span>
          </h1>
          <p
            className="mt-8 max-w-md text-lg leading-relaxed"
            style={{ color: 'var(--graphite)' }}
          >
            A batteries-included starter from{' '}
            <a
              href="https://erlinerd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--ink)' }}
            >
              erlinerd
            </a>
            . A Next.js site, a Vite + Electron desktop app, a Hono backend, and
            one shared design system — opinionated, wired up, ready to build on.
          </p>

          {apiMessage ? (
            <p
              className="mt-6 font-mono text-xs"
              style={{ color: 'var(--graphite)' }}
            >
              <span style={{ color: 'var(--vermilion)' }}>●</span> GET
              /api/hello → {apiMessage}
            </p>
          ) : null}
        </section>

        {/* Right: mark + seal + waitlist card (5 cols) */}
        <aside className="flex flex-col gap-8 lg:col-span-5">
          {/* The line-art mark with the vermilion seal — the page's signature */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              className="overflow-hidden rounded-2xl"
              style={{ background: 'oklch(0.96 0.01 85)' }}
            >
              <img
                src="/icon.png"
                alt="Startup mark — a hand-drawn line portrait"
                width={512}
                height={512}
                className="aspect-square w-full object-cover"
              />
            </div>
            {/* Vermilion seal: the one memorable element, like a workshop chop */}
            <div
              className="seal-pop absolute -right-3 -bottom-3 flex size-16 items-center justify-center rounded-md text-xl font-bold text-white shadow-lg sm:size-20 sm:text-2xl"
              style={{
                background: 'var(--vermilion)',
                transform: 'rotate(-10deg)',
              }}
              aria-hidden
            >
              <span className="font-display">S</span>
            </div>
          </div>

          {/* Waitlist card */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 rounded-xl p-6"
            style={{
              background: 'oklch(1 0 0)',
              border: '1px solid var(--rule)',
            }}
            noValidate
          >
            <label
              htmlFor="email"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--graphite)' }}
            >
              Join the waitlist
            </label>
            <div className="flex flex-col gap-2.5">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-label="Email"
                className="h-11 w-full rounded-md px-3 text-sm outline-none transition-shadow focus-visible:ring-2"
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--rule)',
                  // @ts-expect-error -- CSS custom prop via React style
                  '--tw-ring-color': 'var(--vermilion)',
                }}
                {...register('email')}
              />
              {errors.email ? (
                <p className="text-xs" style={{ color: 'var(--vermilion)' }}>
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="mt-1 inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'var(--ink)' }}
            >
              Get early access
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>
        </aside>
      </main>

      {/* ── Footer: site-map style, like a colophon ── */}
      <footer
        className="mx-auto max-w-6xl px-6 py-8 sm:px-10"
        style={{ borderTop: '1px solid var(--rule)' }}
      >
        <div
          className="flex flex-col items-start justify-between gap-3 text-xs sm:flex-row sm:items-center"
          style={{ color: 'var(--graphite)' }}
        >
          <span>
            <a
              href="https://erlinerd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--ink)' }}
            >
              erlinerd.com
            </a>{' '}
            · MIT License
          </span>
          <span className="flex gap-4">
            <span>landing</span>
            <span>desktop</span>
            <span>server</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
