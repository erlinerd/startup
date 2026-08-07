<p align="center">
  <img src="apps/desktop/public/favicon.png" width="64" height="64" alt="startup logo">
</p>

<h1 align="center">startup</h1>

<p align="center">
  A batteries-included, full-stack monorepo starter by <a href="https://erlinerd.com">erlinerd</a>.
  <br>
  One codebase — landing site, desktop app, and API server.
</p>

<p align="center">
  <a href="https://github.com/erlinerd/startup/actions/workflows/ci.yml"><img src="https://github.com/erlinerd/startup/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/erlinerd/startup"><img src="https://img.shields.io/badge/license-MIT-0f3d2e?style=flat-square" alt="MIT license"></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-9-2f6f4f?style=flat-square" alt="pnpm 9"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-100%25-3178c6?style=flat-square" alt="100% TypeScript"></a>
  <a href="https://oxc.rs/docs/guide/usage/linter"><img src="https://img.shields.io/badge/lint-oxlint-3a7d5a?style=flat-square" alt="oxlint"></a>
</p>

---

## Stack

| Area              | Tech                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **landing site**  | Next.js 16 (App Router), Tailwind CSS v4, Hono mounted in-Next (`/api/*`), react-hook-form + zod, next/font (Fraunces + Inter) |
| **desktop app**   | Vite 8, React 19, Electron, React Router 8, Zustand, TanStack Query, ky, sonner, Fraunces + Inter (Google Fonts)               |
| **backend**       | Hono on Node.js (@hono/node-server), Vercel AI SDK, @t3-oss/env, zod                                                           |
| **data**          | Drizzle ORM, LibSQL (SQLite / Turso), drizzle-kit, drizzle-zod                                                                 |
| **design system** | `@repo/ui` — a shadcn/ui registry (Button, Card, tokens) shared by landing + desktop                                           |
| **tooling**       | Turborepo, pnpm 9, oxLint, Prettier, Husky, lint-staged, commitlint, Vitest, GitHub Actions                                    |

Everything is **100% TypeScript** — including config files (`next.config.ts`, `postcss.config.ts`, `lint-staged.config.ts`, …).

## Design

Both surfaces share one editorial identity, anchored to the hand-drawn
line-art mark: a **paper** background, warm **ink** text (not pure black),
a single **vermilion** accent, and a rotated seal mark as the signature
element — like a workshop chop on a finished piece.

- **Palette** — paper `oklch(0.98 0.008 85)`, ink `oklch(0.2 0.012 85)`,
  graphite `oklch(0.46 0.012 85)`, vermilion `oklch(0.6 0.17 28)`.
- **Type** — Fraunces (display) + Inter (body). Landing self-hosts via
  `next/font`; desktop loads the same faces from Google Fonts.
- **Scope** — tokens live in `.landing` (landing) and `.editorial`
  (desktop) so the shadcn defaults used elsewhere stay untouched.
- **Layout** — asymmetric editorial split (7/5) with section-numbered
  eyebrows on landing; the desktop home mirrors it as a labeled demo grid.

## Project structure

```text
startup
├── apps/
│   ├── landing/          # Next.js marketing site (port 15000) — editorial design + in-Next Hono API
│   ├── desktop/          # Vite + React + Electron — isomorphic SPA (port 15100)
│   │   ├── src/          #   shared renderer (also builds a static web bundle) + vitest suite
│   │   └── electron/     #   main process + preload (sandboxed, contextIsolation)
│   └── server/           # Hono API on Node.js via @hono/node-server (port 15200)
├── packages/
│   ├── ui/               # @repo/ui — shadcn/ui registry (components, cn, tokens)
│   ├── db/               # @repo/db — Drizzle schema + LibSQL client factory
│   └── typescript-config/# shared tsconfig presets
├── .github/workflows/    # ci.yml — one workflow: CI gates (push/PR), changesets (push main), CD build+publish (v* tags)
└── turbo.json            # task orchestration
```

## Getting started

Requires **Node.js ≥ 22.22** and **pnpm 9**:

```sh
pnpm install
pnpm dev        # starts all apps in watch mode
```

Or run a single workspace:

```sh
pnpm dev --filter landing     # http://localhost:15000
pnpm dev --filter server      # http://localhost:15200
pnpm dev --filter desktop     # Vite renderer only (HMR)
pnpm --filter desktop electron:dev   # Vite + Electron window
```

## Scripts

| Command              | What it does                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`           | Run every app in watch mode (turbo)                                                                                   |
| `pnpm build`         | Type-check + build all apps (`landing` → `.next`, `desktop` → `dist` + `dist-electron`, `server` → `dist/` via `tsc`) |
| `pnpm lint`          | oxLint across all workspaces                                                                                          |
| `pnpm check-types`   | `tsc --noEmit` / `tsc -b` per workspace                                                                               |
| `pnpm test`          | Vitest across all five workspaces (ui, db, server, landing, desktop)                                                  |
| `pnpm test:coverage` | Same tests with coverage — enforces the per-package thresholds                                                        |
| `pnpm format`        | Prettier write                                                                                                        |
| `pnpm format:check`  | Prettier check (CI gate)                                                                                              |
| `pnpm commitlint`    | Validate commit message (via husky)                                                                                   |

Use `--filter <name>` for a single workspace: `pnpm test --filter server`.

## Environment

Each app reads its env at runtime; keys are **optional** by default so the
stack builds and tests with zero secrets. See each app's README for details.

> **Where env files live** — each tool reads its own directory, a root
> `.env.local` is ignored by all of them:
>
> - Next.js reads `apps/landing/.env.local`
> - Vite reads `apps/desktop/.env.local`
> - Node reads `apps/server/.env` (loaded by `tsx`/`node` via
>   `--env-file-if-exists`, so it's optional)

| Variable               | App     | Where        | Purpose                                                                                          |
| ---------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `VITE_SERVER_URL`      | desktop | `.env.local` | API base URL (default `http://localhost:15200/`)                                                 |
| `DATABASE_URL`         | server  | `.env`       | LibSQL URL (`libsql://…` or `file:…`); unset → `/users` returns 503                              |
| `DATABASE_AUTH_TOKEN`  | server  | `.env`       | Turso auth token                                                                                 |
| `OPENAI_API_KEY`       | server  | `.env`       | Enables `POST /api/chat` (streaming)                                                             |
| `OPENAI_MODEL`         | server  | `.env`       | Model id, default `gpt-4o`                                                                       |
| `CORS_ORIGINS`         | server  | `.env`       | Comma-separated allowlist; unset = dev defaults (localhost + Electron `null`), set = locked down |
| `PORT`                 | server  | `.env`       | Server port (default `15200`)                                                                    |
| `NEXT_PUBLIC_APP_NAME` | landing | `.env.local` | Brand name shown on the site                                                                     |

Copy `.env.example` values into the right file above as needed; never commit
secrets. `.env.example` documents the full list; `apps/server/.env.example`
is the server-specific template.

## Server endpoints

| Route            | Behavior                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `GET /`          | Health check (`{ status: "ok", time }`)                                                          |
| `GET /users`     | First 100 users from LibSQL (503 if `DATABASE_URL` unset)                                        |
| `POST /api/chat` | Streaming chat completion via AI SDK (400 without `prompt`, 413 over 10k chars, 503 without key) |

## Landing endpoints

The Next.js app mounts Hono inside itself (`app/api/[...route]/route.ts`),
so the landing site can ship API routes without a separate server:

| Route             | Behavior                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| `GET /api/hello`  | Demo greeting (`{ "message": "Hello from Hono!" }`)                              |
| `POST /api/hello` | Personalized greeting — `{ "name": "Alice" }` → `{ "message": "Hello, Alice!" }` |

## Desktop packaging

```sh
pnpm --filter desktop icons:generate   # regenerate build/ icons from favicon.png
pnpm --filter desktop build            # renderer + electron main/preload
pnpm --filter desktop electron:build   # current-platform installer (dmg/zip, nsis, AppImage)
```

Auto-updates use `electron-updater` against GitHub Releases
(`electron-builder.yml` → `publish: github`). A single **CI/CD workflow**
(`ci.yml`) handles everything:

- **push to main / PR** → quality gates (lint, format, types, tests,
  coverage, build)
- **push to main** → the Changesets lane opens the "Version Packages" PR;
  merging it bumps versions + CHANGELOGs
- **push a `v*` tag** → builds macOS (universal dmg), Windows (nsis x64 +
  arm64), and Linux (AppImage) installers and publishes them to GitHub
  Releases (the tag must match `apps/desktop`'s version)

Release flow: `pnpm changeset` → push → merge the version PR → tag
`git tag v<version> && git push origin v<version>` → installers ship. See
`apps/desktop/README.md` for the full flow.

## Rebranding / forking

The starter ships with `erlinerd` as the brand. To make it yours, update:

1. **`apps/landing/app/layout.tsx`** — `metadataBase`, `title`, and
   `description` (SEO points at the author's domain otherwise); plus
   **`apps/landing/app/icon.png`** — the favicon mark (Next.js auto-serves it)
2. **`apps/landing/app/page.tsx`** and **`apps/desktop/src/routes/home.tsx`**
   — "by erlinerd" copy and links
3. **`apps/landing/env.ts`** and the root **`.env.example`** — the
   `NEXT_PUBLIC_APP_NAME` default (`'Startup'`)
4. **`apps/desktop/electron-builder.yml`** — `appId`, `productName`, and
   `publish.owner`/`publish.repo` (auto-update checks GitHub Releases there)
5. **`apps/desktop/index.html`** — `<title>`
6. **`apps/desktop/src/App.tsx`** — the "Startup" logo/brand link in the nav
7. **`apps/desktop/public/favicon.png`** — the mark itself (icons regenerate
   from it)
8. **`SECURITY.md`** — the contact email and private disclosure link
9. **`package.json`** — the root `author`/`homepage`/`repository`/`bugs`
   metadata, and `LICENSE` — the copyright line
10. `README.md` / `AGENTS.md` references, and the git remote

## Contributing

See `CONTRIBUTING.md` — branch off `main`, keep commits conventional
(`feat:`, `fix:`, `build:`, …). Hooks enforce lint + formatting on staged
files and commit message format. CI runs lint → format check → types →
tests → tests with coverage → build.

---

<p align="center">
  <a href="https://erlinerd.com">erlinerd.com</a> · <a href="https://github.com/erlinerd/startup">GitHub</a>
</p>
