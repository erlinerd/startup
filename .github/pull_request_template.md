## What changed

<!-- Describe the change and why. Link any related issue. -->

## Checklist

- [ ] I read `AGENTS.md` and `CONTRIBUTING.md`
- [ ] `pnpm lint` passes (0 errors)
- [ ] `pnpm check-types` passes
- [ ] `pnpm test` passes
- [ ] `pnpm test:coverage` passes (CI enforces the per-package thresholds)
- [ ] `pnpm build` passes
- [ ] `pnpm format:check` passes
- [ ] Conventional commit message (`feat:`, `fix:`, `docs:`, `build:`, `chore:`, …)

<!-- If you touched apps/desktop: -->

- [ ] `pnpm --filter desktop build` still packages (electron main/preload compile)
