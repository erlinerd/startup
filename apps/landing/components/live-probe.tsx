'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '../lib/locale'

type Probe = { message: string; ms: number | null; failed: boolean }

/**
 * Live proof that Hono runs inside the Next.js app: hits GET /api/hello on
 * this very deployment and shows the real answer. No mock, no screenshot.
 */
export function LiveProbe() {
  const { d } = useLocale()
  const [probe, setProbe] = useState<Probe | null>(null)

  useEffect(() => {
    const start = performance.now()
    fetch('/api/hello')
      .then((res) => res.json() as Promise<{ message?: string }>)
      .then((data) =>
        setProbe({
          // Empty string means "no message"; the render resolves the
          // localized fallback so the effect stays locale-independent.
          message: data.message ?? '',
          ms: Math.round(performance.now() - start),
          failed: false,
        }),
      )
      .catch(() => setProbe({ message: '', ms: null, failed: true }))
  }, [])

  return (
    <div
      className="rounded-xl p-5 sm:p-6"
      style={{ background: 'var(--slab)', color: 'var(--slab-ink)' }}
      aria-live="polite"
    >
      <p
        className="font-mono text-[0.8rem] sm:text-[0.85rem]"
        style={{ color: 'var(--slab-dim)' }}
      >
        <span style={{ color: 'var(--vermilion)' }} aria-hidden>
          ${' '}
        </span>
        <span className="probe-echo">
          GET https://starter.erlinerd.com/api/hello
        </span>
      </p>

      {probe === null ? (
        <div className="mt-4 space-y-2" aria-hidden>
          <div
            className="h-3.5 w-4/5 animate-pulse rounded-sm opacity-20"
            style={{ background: 'var(--slab-dim)' }}
          />
          <div
            className="h-3.5 w-3/5 animate-pulse rounded-sm opacity-20"
            style={{ background: 'var(--slab-dim)' }}
          />
        </div>
      ) : (
        <div className="probe-answer mt-4 font-mono text-[0.8rem] sm:text-[0.85rem]">
          <p>
            {'{ '}
            <span style={{ color: 'var(--vermilion)' }}>
              &quot;message&quot;
            </span>
            : &quot;{probe.message || d.probe.empty}&quot;
            {' }'}
          </p>
          <p className="mt-3" style={{ color: 'var(--slab-dim)' }}>
            {probe.failed
              ? d.probe.failLine
              : d.probe.okLine.replace('{ms}', String(probe.ms))}
          </p>
        </div>
      )}
    </div>
  )
}
