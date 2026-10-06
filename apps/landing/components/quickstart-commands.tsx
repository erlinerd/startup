'use client'

import { useState } from 'react'
import { useLocale } from '../lib/locale'

const COMMANDS = ['pnpm install', 'pnpm dev'] as const

/** The two-command pitch, with real clipboard buttons. */
export function QuickstartCommands() {
  const { d } = useLocale()
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(cmd: string) {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(cmd)
      setTimeout(() => setCopied((c) => (c === cmd ? null : c)), 1600)
    } catch {
      // Clipboard blocked (http, permissions): selecting the text still works.
    }
  }

  return (
    <div
      className="rounded-xl"
      style={{ background: 'var(--slab)', color: 'var(--slab-ink)' }}
    >
      {COMMANDS.map((cmd) => (
        <div
          key={cmd}
          className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
        >
          <p className="font-mono text-sm sm:text-[0.9rem]">
            <span style={{ color: 'var(--vermilion)' }} aria-hidden>
              ~ ${' '}
            </span>
            {cmd}
          </p>
          <button
            type="button"
            onClick={() => copy(cmd)}
            className="shrink-0 rounded-md px-2.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors"
            style={{
              color: copied === cmd ? 'var(--vermilion)' : 'var(--slab-dim)',
              border:
                '1px solid color-mix(in oklab, var(--slab-dim) 45%, transparent)',
            }}
            aria-label={d.quickstart.copyLabel.replace('{cmd}', cmd)}
          >
            {copied === cmd ? d.quickstart.copied : d.quickstart.copy}
          </button>
        </div>
      ))}
    </div>
  )
}
