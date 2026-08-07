# desktop

Isomorphic Vite + React + Electron app. The same `src/` builds both:

- a **static web bundle** (`dist/`) — deployable to any static host
- an **Electron desktop app** — packaged via electron-builder into `release/`

## Scripts

| Script                | What it does                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm dev`            | Vite dev server (renderer only)                                                          |
| `pnpm electron:dev`   | Vite dev server + Electron window (HMR)                                                  |
| `pnpm build`          | `tsc -b && vite build` — renderer (`dist/`) + electron main/preload (`dist-electron/`)   |
| `pnpm electron:dir`   | Unpacked app into `release/mac-arm64/` (fast smoke test)                                 |
| `pnpm electron:build` | Full installer for the current platform (dmg/zip on mac, nsis on win, AppImage on linux) |

> The web target runs in a browser; the Electron target loads `dist/index.html` via `file://` and switches the router to `HashRouter` automatically (`src/lib/router.tsx`).

## Building installers

```sh
pnpm --filter desktop build          # renderer + main + preload
pnpm --filter desktop electron:build
```

- **macOS**: `dmg` + `zip`. Without a signing identity (or with
  `CSC_IDENTITY_AUTO_DISCOVERY=false`) the app is unsigned — fine for local
  testing, blocked by Gatekeeper for other users.
- **Windows**: `nsis` (build on Windows or in CI with wine).
- **Linux**: `AppImage`.

## Auto-updates

`electron/main.ts` checks GitHub Releases via `electron-updater` at startup.
The feed is configured in `electron-builder.yml` (`publish: github`, repo
`erlinerd/startup`). It no-ops silently when no release exists yet. To ship an
update:

1. Bump the version first: `pnpm changeset` → `pnpm version:packages`
   (electron-updater compares `package.json` `version` — the tag alone is not
   enough).
2. Tag and push: `git tag v0.1.0 && git push origin v0.1.0` — CI's
   `electron-build` job builds mac (universal dmg) + win (nsis exe) and
   publishes them to the release feed.
3. Sign the build (CSC_LINK/CSC_KEY_PASSWORD) for macOS auto-update to work.
