# server

Hono backend on Node.js, served via [`@hono/node-server`](https://github.com/honojs/node-server).
Routes: `GET /` (health), `GET /users` (Drizzle/LibSQL), `POST /api/chat`
(Vercel AI SDK, streamed). Dev runs with `tsx watch`, production runs the `tsc`
output under `node`.

## Develop

```sh
pnpm install
pnpm dev          # from the repo root, or:
pnpm dev --filter server   # → http://localhost:15200
```

Env is loaded from `apps/server/.env` (see `.env.example`). All keys are
optional — the server starts and its tests run with zero secrets; routes that
need a key (`/users`, `/api/chat`) degrade gracefully.

## Scripts

| Script             | What it does                                                                       |
| ------------------ | ---------------------------------------------------------------------------------- |
| `pnpm dev`         | `tsx watch` with auto-reload (HMR)                                                 |
| `pnpm build`       | `tsc` → `dist/` (type-checks + emits artifacts)                                    |
| `pnpm start`       | Run the server (`tsx src/index.ts` — resolves the raw-TS `@repo/db` workspace dep) |
| `pnpm lint`        | oxLint                                                                             |
| `pnpm check-types` | `tsc --noEmit`                                                                     |
| `pnpm test`        | Vitest                                                                             |

## Deploy

> **Run migrations before the first deploy**, or `/users` will return 500
> ("no such table"). Point `DATABASE_URL` at your production Turso database
> and push the schema:

```sh
DATABASE_URL=libsql://<your-db>.turso.io \
DATABASE_AUTH_TOKEN=<token> \
pnpm --filter @repo/db db:push
```

Then build and start the server, with secrets provided by your host's
environment (a `.env` file for local/PM2, injected env vars on a PaaS, etc.):

```sh
pnpm --filter server build
pnpm --filter server start
```

CORS is open to localhost and the Electron `null` origin in dev. Lock it down
in production by setting `CORS_ORIGINS=https://your-app.com`.

## How env works

The app reads env per-request via a lazy factory (`src/env.ts`): in production
it merges `process.env`; in tests, Hono's `app.request(url, init, bindings)`
injects bindings that override `process.env`. Validation only runs when a
request comes in, so importing the module (e.g. in tests) never throws.
