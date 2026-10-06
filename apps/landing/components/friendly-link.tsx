'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLocale } from '../lib/locale'

/**
 * The one friendly link on the page: where the author writes and builds.
 * A single hairline band, deliberately not a card and not a link wall.
 */
export function FriendlyLink() {
  const { d } = useLocale()

  return (
    <section className="border-t" style={{ borderColor: 'var(--rule)' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-0 py-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-light tracking-tight">
            {d.links.authorHeading}
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--graphite)' }}>
            {d.links.authorLine}
          </p>
        </div>
        <a
          href="https://erlinerd.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: 'var(--vermilion)' }}
        >
          {d.links.authorLabel}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  )
}
