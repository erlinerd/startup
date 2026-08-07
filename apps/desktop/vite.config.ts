import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron/simple'
import renderer from 'vite-plugin-electron-renderer'

// https://vite.dev/config/
// One config builds three targets (isomorphic):
//   - renderer  : the React app (this Vite dev server / `dist`)
//   - main      : Electron main process  -> `dist-electron/main.js` (ESM)
//   - preload   : Electron preload script -> `dist-electron/preload.mjs`
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // Replace the dev-grade CSP <meta> with a strict production policy at
    // build time. Electron's webRequest API never fires for file:// loads
    // (electron#22370, by design), so runtime header injection can't secure
    // production — the built index.html is the only layer that applies there.
    {
      name: 'prod-csp',
      apply: 'build',
      transformIndexHtml(html) {
        const strict = [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "connect-src 'self' http://localhost:*",
        ].join('; ')
        return html.replace(
          /content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http:\/\/localhost:\* https:;"/,
          `content="${strict}"`,
        )
      },
    },
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            // Vite 8 uses rolldown; keep the output as ESM for `type: module`.
            // Note: the emitted filename is `main.js` (ESM content), not `.mjs`.
            rolldownOptions: {
              output: { format: 'es' },
            },
          },
        },
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            rolldownOptions: {
              output: { format: 'es' },
            },
          },
        },
      },
      // Lets the renderer `import` Node/Electron APIs when needed (polyfilled).
      renderer: {},
    }),
    renderer(),
  ],
})
