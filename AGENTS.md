# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, ZCode, etc.) working in
this repository. Read this first — it will save you from common mistakes.

## What this repo is

A pnpm 9 + Turborepo monorepo ("startup") with three apps and three packages.
Read `README.md` for the user-facing overview; this file is the operational
manual.

> **Note on the directory name:** the local on-disk folder is `starup` (a
> historical typo of `startup`). All package names, badges, CI, and identifiers
> use the correct spelling `startup`. The folder name is cosmetic — don't
> "fix" it by editing identifiers, and don't rely on the folder name in scripts
> (use `pnpm --filter <name>` instead).

## Non-negotiables

1. **Everything is TypeScript.** Config files are `.ts` too
   (`next.config.ts`, `postcss.config.ts`, `lint-staged.config.ts`,
   `commitlint.config.ts`, `drizzle.config.ts`). Never introduce `.js`/`.mjs`
   configs — `lint-staged` and the other tools all load `.ts` natively here.
2. **`@repo/ui` ships raw `.tsx` source** (no build step, exports point at
   `src/`). The Next.js app relies on `transpilePackages: ['@repo/ui']`
   (`apps/landing/next.config.ts`); the Vite app resolves it via bundler
   resolution. Don't "fix" the ui package by adding a build step — it's
   intentional.
3. **Design tokens live once**: `packages/ui/src/styles/globals.css` holds
   the Tailwind v4 theme. Apps import it via a **relative path**
   (`@import '../../../packages/ui/src/styles/globals.css'`) plus
   `@source '../../../packages/ui/src'` — a package-path `@import` breaks
   under vite-plugin-electron's rolldown build. Keep the relative form.
4. **Env validation is lazy.** `apps/server/src/env.ts` wraps
   `@t3-oss/env-core` in a factory (`createAppEnv(runtimeEnv)`) so importing
   the module never validates. Validation happens per-request: the env
   middleware merges `{ ...process.env, ...c.env }` (production reads
   `process.env`, tests inject bindings via `app.request()`'s third arg which
   override it). All keys are optional — CI and tests run with zero secrets.
5. **The server's DB client is memoized by URL string**, not by the env
   object (a fresh env object is built per request). Don't revert to a
   `WeakMap<AppEnv>` keyed cache — it never hits.

## Commands

Run from the repo root. Always use `pnpm`, never npm/yarn.

| Task       | Command                                                  |
| ---------- | -------------------------------------------------------- |
| Install    | `pnpm install`                                           |
| Dev (all)  | `pnpm dev`                                               |
| Dev (one)  | `pnpm dev --filter <name>`                               |
| Lint       | `pnpm lint`                                              |
| Type check | `pnpm check-types`                                       |
| Test       | `pnpm test` (all five: ui, db, server, landing, desktop) |
| Coverage   | `pnpm test:coverage` (enforces per-package thresholds)   |
| Build all  | `pnpm build`                                             |
| Format     | `pnpm format`                                            |

Workspace names: `landing`, `desktop`, `server`, `@repo/ui`, `@repo/db`,
`@repo/typescript-config`.

## Architecture map

```text
apps/landing  (Next.js 16, port 15000)
  └─ imports @repo/ui/components/*  (transpiled via transpilePackages)

apps/desktop  (Vite 8 + Electron, port 15100)
  ├─ src/            renderer — React Router (HashRouter under file://,
  │                  BrowserRouter on web, switched in src/lib/router.tsx)
  ├─ electron/       main process (ESM) + preload (sandboxed bridge)
  └─ dist/ dist-electron/  web bundle + electron outputs

apps/server   (Hono on Node.js via @hono/node-server, port 15200)
  ├─ src/index.ts    app + serve() (guarded by import.meta.main)
  ├─ src/env.ts      env factory (lazy, process.env + per-request injection)
  ├─ src/lib/db.ts   memoized LibSQL → Drizzle client
  ├─ src/lib/ai.ts   AI SDK streamText (createOpenAI per call)
  └─ routes: GET /, GET /users, POST /api/chat

packages/ui   shadcn/ui registry (no build; source exports)
packages/db   Drizzle schema + createDb(client) factory + migrations/
```

## Common pitfalls

- **`apps/server/src/index.test.ts`** intentionally asserts `/users` with
  `:memory:` returns 500 (the table doesn't exist server-side — migrations
  live in `packages/db`; the 500 proves the request got past the
  not-configured guard). Full insert/read coverage lives in
  `packages/db/src/db.test.ts` which runs the committed migrations. Keep that
  split; don't duplicate DB tests in the server.
- **The server runs via `tsx`, not bare `node`**: `@repo/db` ships raw TS
  source (no build step, same philosophy as `@repo/ui`), so `node dist/…`
  cannot resolve it. `start`/`dev` use `tsx src/index.ts`; `build` still
  type-checks and emits `dist/` as a deployable artifact. Don't "fix" this by
  adding a build step to `@repo/db`.
- **oxLint is strict**: `correctness` category is `error`. Demo code must
  follow hooks rules; no constant boolean expressions (`false && x`) in
  tests; unused imports/vars fail `tsc -b` on desktop (`noUnusedLocals`).
- **Electron packaging**: `electron-builder.yml` expects
  `dist-electron/main.js` (ESM content, `.js` extension — not `.mjs`) and
  `preload.mjs`. `electron-updater` is a **runtime dependency** (must ship in
  the asar — don't move it back to devDependencies).
- **App icons**: `build/icon.png` (win/linux source) is **tracked**;
  `build/icon.icns` (mac) is derived and gitignored. The source is
  `public/favicon.png` (a 512×512 PNG — not SVG: `sips` can't rasterize SVG).
  After changing it, run `pnpm --filter desktop icons:generate` on macOS
  (regenerates both) and commit the new icon.png. CI runs the same script.
- **CI skips the electron binary** (`ELECTRON_SKIP_BINARY_DOWNLOAD=1`) — the
  `build` task never needs it; only `electron:build` does.
- **Migrations**: `packages/db/migrations/` is committed. Run
  `DATABASE_URL=… pnpm --filter @repo/db db:push` before first deploy or
  `/users` 500s with "no such table".
- **CORS**: dev allowlist = localhost + `null` (Electron file://). Set
  `CORS_ORIGINS` in production; don't open it to `*`.

## Verifying your changes

After any change, run (fast first, full before finishing):

```sh
pnpm lint && pnpm check-types
pnpm test && pnpm test:coverage
pnpm build
```

All must pass (counts drift as workspaces change — check the turbo summary).
Report failures honestly — do not claim green builds that failed.
