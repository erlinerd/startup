# GitHub Copilot instructions

This repo has a detailed operational manual at [`AGENTS.md`](../AGENTS.md).
Read it first — it covers the non-negotiables (TypeScript-everything config,
`@repo/ui` ships raw source, relative-path CSS imports, lazy env validation,
DB-client memoization by URL), the command matrix, the architecture map, and
common pitfalls that will trip you up.

**Always follow `AGENTS.md`.** The notes below are a quick orientation; when in
doubt, defer to `AGENTS.md` and the existing code patterns.

## Quick orientation

- pnpm 9 + Turborepo monorepo: `apps/{landing,desktop,server}` +
  `packages/{ui,db,typescript-config}`.
- Commands run from the repo root with `pnpm` (never npm/yarn):
  `pnpm dev`, `pnpm lint`, `pnpm check-types`, `pnpm test`, `pnpm build`.
- All four gates must pass before finishing. Report failures honestly.
- Config files are `.ts` (e.g. `lint-staged.config.ts`, `next.config.ts`) —
  never introduce `.js`/`.mjs` configs.
