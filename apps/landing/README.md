# landing

Next.js 16 (App Router) marketing site — Tailwind CSS v4, shadcn/ui,
react-hook-form + zod, sonner.

## Develop

```sh
pnpm dev        # http://localhost:15000
```

## Scripts

| Script             | What it does                    |
| ------------------ | ------------------------------- |
| `pnpm dev`         | Next dev server (port 15000)    |
| `pnpm build`       | Production build (`next build`) |
| `pnpm start`       | Serve the production build      |
| `pnpm lint`        | oxLint                          |
| `pnpm check-types` | `next typegen && tsc --noEmit`  |

## Environment

See `env.ts` (validated with `@t3-oss/env-nextjs`). All keys are optional:

| Variable               | Default   | Purpose                      |
| ---------------------- | --------- | ---------------------------- |
| `NEXT_PUBLIC_APP_NAME` | `Startup` | Brand name shown on the site |

## Design system

The site consumes components from `@repo/ui` (a shadcn/ui registry) via
`transpilePackages`. Tokens live in
`packages/ui/src/styles/globals.css` — edit there, not in this app.

## API routes

A Hono app is mounted at `/api` via a catch-all route
(`app/api/[...route]/route.ts`, using `hono/vercel`'s `handle()`). The homepage
fetches `GET /api/hello` to demonstrate the integration. Add routes inside the
`basePath('/api')` Hono app in that file.

> Note: with an active API route, `output: 'export'` (static-only export) is no
> longer available — the app requires a Node.js runtime (Vercel, self-hosted,
> etc.). The default `next build`/`next start` flow works as-is.

## Deploy

- **Vercel** (default): `pnpm build` → deploy on Vercel. Next.js App Router is
  supported natively (no separate adapter needed).
- **Self-hosted (Node)**: `pnpm build && pnpm start` serves the production
  build.
