'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { FriendlyLink } from '../components/friendly-link'
import { LiveProbe } from '../components/live-probe'
import { QuickstartCommands } from '../components/quickstart-commands'
import { ThemeToggle } from '../components/theme-toggle'
import { env } from '../env'
import { useLocale } from '../lib/locale'

const GITHUB_URL = 'https://github.com/erlinerd/startup'

export default function Home() {
  const { locale, setLocale, d } = useLocale()
  const zh = locale === 'zh'

  const surfaces = [
    {
      id: 'landing',
      name: 'landing',
      tech: d.surfaces.landing.tech,
      lines: [
        d.surfaces.landing.tailwind,
        d.surfaces.landing.hono,
        d.surfaces.landing.forms,
      ],
    },
    {
      id: 'desktop',
      name: 'desktop',
      tech: d.surfaces.desktop.tech,
      lines: [
        d.surfaces.desktop.react,
        d.surfaces.desktop.platforms,
        d.surfaces.desktop.updater,
      ],
    },
    {
      id: 'server',
      name: 'server',
      tech: d.surfaces.server.tech,
      lines: [
        d.surfaces.server.ai,
        d.surfaces.server.db,
        d.surfaces.server.env,
      ],
    },
  ] as const

  const shared = [
    { name: '@repo/ui', body: d.shared.ui.body },
    { name: '@repo/db', body: d.shared.db.body },
  ] as const

  const tooling = [
    {
      group: d.tooling.group.monorepo,
      items: [d.tooling.pnpm, d.tooling.turborepo, d.tooling.changesets],
    },
    {
      group: d.tooling.group.quality,
      items: [d.tooling.oxlint, d.tooling.prettier, d.tooling.vitest],
    },
    {
      group: d.tooling.group.git,
      items: [d.tooling.husky, d.tooling.lintstaged, d.tooling.commitlint],
    },
    {
      group: d.tooling.group.cicd,
      items: [d.tooling.gha, d.tooling.builds, d.tooling.cloudflare],
    },
  ] as const

  const tree = `startup
├── apps/
│   ├── landing/          Next.js site · port 15000
│   ├── desktop/          Vite + Electron · port 15100
│   └── server/           Hono API · port 15200
├── packages/
│   ├── ui/               @repo/ui (shadcn registry)
│   ├── db/               @repo/db (Drizzle + migrations)
│   └── typescript-config/
└── turbo.json`

  return (
    <div lang={locale} className="landing min-h-svh">
      {/* ── Nav: one line, anchors + toggles + a single outbound action ── */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md"
        style={{
          background: 'color-mix(in oklab, var(--paper) 82%, transparent)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 sm:px-10">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/icon.png"
              alt=""
              aria-hidden
              width="28"
              height="28"
              className="size-7 rounded-md"
            />
            <span className="font-display text-lg font-medium tracking-tight">
              {env.NEXT_PUBLIC_APP_NAME}
            </span>
          </a>
          <div
            className="hidden items-center gap-7 text-sm md:flex"
            style={{ color: 'var(--graphite)' }}
          >
            <a
              href="#stack"
              className="transition-colors hover:text-[var(--ink)]"
            >
              {d.nav.surfaces}
            </a>
            <a
              href="#structure"
              className="transition-colors hover:text-[var(--ink)]"
            >
              {d.nav.structure}
            </a>
            <a
              href="#ship"
              className="transition-colors hover:text-[var(--ink)]"
            >
              {d.nav.ship}
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLocale(zh ? 'en' : 'zh')}
              aria-label={d.nav.langToggle}
              className="flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-[var(--vermilion-soft)] active:scale-95"
              style={{ color: 'var(--graphite)' }}
            >
              {zh ? 'EN' : '中'}
            </button>
            <ThemeToggle />
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 hidden h-9 items-center gap-1.5 rounded-md px-3.5 text-sm font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:inline-flex"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {d.cta.useTemplate}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* ── Hero: left copy, right live proof ── */}
        <section className="relative grid grid-cols-1 items-center gap-12 pb-20 pt-16 lg:grid-cols-12 lg:gap-16 lg:pt-24">
          <div className="lg:col-span-7">
            <p
              className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--vermilion)' }}
            >
              {d.hero.eyebrow}
            </p>
            <h1 className="font-display text-[2.9rem] font-light leading-[1.08] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">
              {d.hero.title}
              <br />
              <span
                className={zh ? undefined : 'italic'}
                style={{ color: 'var(--vermilion)' }}
              >
                {d.hero.titleAccent}
              </span>
            </h1>
            <p
              className="mt-7 max-w-md text-lg leading-relaxed"
              style={{ color: 'var(--graphite)' }}
            >
              {d.hero.ledeLead}{' '}
              <span style={{ color: 'var(--ink)' }}>{d.hero.ledeAuthor}</span>
              {d.hero.ledeTail}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md px-5 text-sm font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                {d.cta.useTemplate}
                <ArrowRight className="size-4" aria-hidden />
              </a>
              <a
                href="#stack"
                className="inline-flex h-12 items-center rounded-md px-5 text-sm font-medium transition-colors"
                style={{
                  border: '1px solid var(--rule)',
                  color: 'var(--graphite)',
                }}
              >
                {d.hero.secondaryCta}
              </a>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <LiveProbe />
            <p className="mt-3 text-xs" style={{ color: 'var(--graphite)' }}>
              {d.probe.caption}
            </p>
          </aside>
        </section>

        {/* ── Surfaces: three apps, asymmetric ── */}
        <section
          id="stack"
          className="rise border-t py-20 sm:py-24"
          style={{ borderColor: 'var(--rule)' }}
        >
          <h2 className="max-w-lg font-display text-3xl font-light tracking-tight sm:text-4xl">
            {d.surfaces.heading}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {surfaces.map((s, i) => (
              <article key={s.id} className={i === 1 ? 'md:pt-10' : undefined}>
                <div
                  className="flex h-full flex-col rounded-xl p-5 sm:p-6"
                  style={{
                    background:
                      i === 1 ? 'var(--vermilion-soft)' : 'var(--card)',
                    border: '1px solid var(--rule)',
                  }}
                >
                  <p
                    className="font-mono text-sm font-medium"
                    style={{ color: 'var(--vermilion)' }}
                  >
                    {s.name}
                  </p>
                  <h3 className="mt-2 font-display text-xl">{s.tech}</h3>
                  <ul
                    className="mt-4 space-y-1.5 text-sm"
                    style={{ color: 'var(--graphite)' }}
                  >
                    {s.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {shared.map((p) => (
              <article
                key={p.name}
                className="rounded-xl p-5 sm:p-6"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--rule)',
                }}
              >
                <p
                  className="font-mono text-sm font-medium"
                  style={{ color: 'var(--vermilion)' }}
                >
                  {p.name}
                </p>
                <p
                  className="mt-3 max-w-prose text-sm leading-relaxed"
                  style={{ color: 'var(--graphite)' }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Structure: the tree, then the commands ── */}
        <section
          id="structure"
          className="rise border-t py-20 sm:py-24"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="max-w-md font-display text-3xl font-light tracking-tight sm:text-4xl">
                {d.structure.heading}
              </h2>
              <p
                className="mt-4 max-w-md text-base leading-relaxed"
                style={{ color: 'var(--graphite)' }}
              >
                {d.structure.body}
              </p>
              <pre
                className="mt-8 overflow-x-auto rounded-xl p-5 text-[0.75rem] leading-relaxed sm:text-xs"
                style={{ background: 'var(--slab)', color: 'var(--slab-dim)' }}
              >
                <code>{tree}</code>
              </pre>
            </div>
            <div className="lg:col-span-5">
              <h3
                className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--graphite)' }}
              >
                {d.structure.dayZero}
              </h3>
              <QuickstartCommands />
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: 'var(--graphite)' }}
              >
                {d.structure.note}
              </p>
            </div>
          </div>
        </section>

        {/* ── Tooling: four groups, not a bullet dump ── */}
        <section
          className="rise border-t py-20 sm:py-24"
          style={{ borderColor: 'var(--rule)' }}
        >
          <h2 className="max-w-lg font-display text-3xl font-light tracking-tight sm:text-4xl">
            {d.tooling.heading}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {tooling.map((group) => (
              <div key={group.group}>
                <p
                  className="mb-4 border-b pb-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    borderColor: 'var(--rule)',
                    color: 'var(--vermilion)',
                  }}
                >
                  {group.group}
                </p>
                <ul
                  className="space-y-2 text-sm"
                  style={{ color: 'var(--graphite)' }}
                >
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ship: two steps ── */}
        <section
          id="ship"
          className="rise border-t py-20 sm:py-24"
          style={{ borderColor: 'var(--rule)' }}
        >
          <h2 className="max-w-xl font-display text-3xl font-light tracking-tight sm:text-4xl">
            {d.ship.heading}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
              className="rounded-xl p-6 sm:p-8"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--rule)',
              }}
            >
              <p
                className="font-mono text-sm"
                style={{ color: 'var(--vermilion)' }}
              >
                git push
              </p>
              <h3 className="mt-3 font-display text-xl">{d.ship.ci.title}</h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--graphite)' }}
              >
                {d.ship.ci.body}
              </p>
            </article>
            <article
              className="rounded-xl p-6 sm:p-8 md:mt-10"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--rule)',
              }}
            >
              <p
                className="font-mono text-sm"
                style={{ color: 'var(--vermilion)' }}
              >
                git tag v1.0.0
              </p>
              <h3 className="mt-3 font-display text-xl">
                {d.ship.release.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: 'var(--graphite)' }}
              >
                {d.ship.release.body}
              </p>
            </article>
          </div>
        </section>

        {/* ── Deploy: this page is the proof ── */}
        <section
          className="rise border-t py-20 sm:py-24"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p
                className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
                style={{ color: 'var(--vermilion)' }}
              >
                {d.deploy.eyebrow}
              </p>
              <h2 className="max-w-2xl font-display text-3xl font-light leading-snug tracking-tight sm:text-4xl">
                {d.deploy.heading}
              </h2>
              <p
                className="mt-5 max-w-xl text-base leading-relaxed"
                style={{ color: 'var(--graphite)' }}
              >
                {d.deploy.bodyLead}{' '}
                <code
                  className="rounded px-1.5 py-0.5 font-mono text-[0.85em]"
                  style={{ background: 'var(--vermilion-soft)' }}
                >
                  apps/landing
                </code>
                {d.deploy.bodyMid}{' '}
                <code
                  className="rounded px-1.5 py-0.5 font-mono text-[0.85em]"
                  style={{ background: 'var(--vermilion-soft)' }}
                >
                  /api
                </code>{' '}
                {d.deploy.bodyTail}
              </p>
            </div>
            <aside className="flex items-end lg:col-span-4">
              <dl
                className="w-full space-y-4 text-sm"
                style={{ color: 'var(--graphite)' }}
              >
                <div
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <dt>{d.deploy.hostingLabel}</dt>
                  <dd className="font-mono" style={{ color: 'var(--ink)' }}>
                    {d.deploy.hostingValue}
                  </dd>
                </div>
                <div
                  className="flex justify-between border-b pb-3"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <dt>{d.deploy.adapterLabel}</dt>
                  <dd className="font-mono" style={{ color: 'var(--ink)' }}>
                    {d.deploy.adapterValue}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>{d.deploy.triggerLabel}</dt>
                  <dd className="font-mono" style={{ color: 'var(--ink)' }}>
                    {d.deploy.triggerValue}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <FriendlyLink />

        {/* ── Final CTA ── */}
        <section
          className="border-t"
          style={{ borderColor: 'var(--rule)', background: 'var(--card)' }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-0 py-14 sm:flex-row sm:items-center sm:py-16">
            <h2 className="max-w-md font-display text-2xl font-light tracking-tight sm:text-3xl">
              {d.cta.heading}
            </h2>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md px-6 text-sm font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              {d.cta.useTemplate}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer: colophon ── */}
      <footer className="border-t" style={{ borderColor: 'var(--rule)' }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs sm:flex-row sm:items-center sm:px-10"
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
              {d.links.authorLabel}
            </a>{' '}
            · {d.footer.license}
          </span>
          <span className="flex gap-4 font-mono">
            <a
              href="#stack"
              className="transition-colors hover:text-[var(--ink)]"
            >
              landing
            </a>
            <a
              href="#stack"
              className="transition-colors hover:text-[var(--ink)]"
            >
              desktop
            </a>
            <a
              href="#stack"
              className="transition-colors hover:text-[var(--ink)]"
            >
              server
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
