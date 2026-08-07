# Contributing

Thanks for contributing to startup!

## Getting started

```sh
pnpm install
pnpm dev
```

Requires **Node.js ≥ 22.22** and **pnpm 9** (see `packageManager` in
`package.json`).

## Before you open a PR

1. Make your change in a focused commit (conventional format: `feat:`,
   `fix:`, `build:`, `docs:`, `chore:`, …).
2. Run the full verification suite — all gates must pass (the task count
   drifts as workspaces change; check the turbo summary):

```sh
pnpm lint
pnpm format:check
pnpm check-types
pnpm test
pnpm test:coverage
pnpm build
```

3. If you touched `apps/desktop`, also confirm the Electron build works:

```sh
pnpm --filter desktop build
pnpm --filter desktop icons:generate   # if icons are involved
```

## House rules

- **Everything is TypeScript** — including config files. No `.js` configs.
- **Design tokens live in `packages/ui`** — apps import them via relative CSS
  paths (see `AGENTS.md`). Don't duplicate tokens per-app.
- **Env keys are optional by default** — tests and CI run with zero secrets.
- Hooks enforce lint + formatting on staged files and commit message format
  on every commit.

## For AI agents

Read `AGENTS.md` — it's the operational manual: non-negotiables, architecture
map, common pitfalls, and the verification workflow.
