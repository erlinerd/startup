import { app, BrowserWindow, session, shell } from 'electron'
import { join } from 'node:path'

let mainWindow: BrowserWindow | null = null

// Dev-only Content-Security-Policy, injected at runtime.
// Electron's webRequest API does NOT fire for file:// loads (electron#22370,
// by design), so runtime injection only reaches the Vite dev server
// (http://localhost:15100). The production policy is baked into index.html at
// build time by the `prod-csp` vite plugin (see vite.config.ts) — that is the
// only CSP layer that applies to the packaged app. Keep both in sync.
const DEV_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // HMR needs inline scripts in dev
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' http://localhost:* ws://localhost:*",
].join('; ')

function installCsp() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [DEV_CSP],
      },
    })
  })
}

// Only http(s) links may leave the app; anything else (file:, custom:) is blocked.
function isSafeExternalUrl(url: string): boolean {
  try {
    const protocol = new URL(url).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(import.meta.dirname, 'preload.mjs'),
      // The renderer is sandboxed and talks to Node only through the preload bridge.
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Open external links in the system browser, not inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  // Block in-page navigation away from the app (e.g. a link with target _self
  // navigating to an external site would otherwise replace the app UI).
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const devServerUrl = process.env['ELECTRON_RENDERER_URL']
    let isDevUrl = false
    try {
      // Exact-origin compare — a prefix match would let a lookalike host
      // (http://localhost:15100.evil.com) through in dev.
      isDevUrl =
        !!devServerUrl && new URL(url).origin === new URL(devServerUrl).origin
    } catch {
      // Malformed URL — treat as external and block below.
      isDevUrl = false
    }
    if (!isDevUrl && !url.startsWith('file://')) {
      event.preventDefault()
      if (isSafeExternalUrl(url)) {
        void shell.openExternal(url)
      }
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  // In dev, Vite serves the renderer (HMR). In production, load the built assets.
  const devServerUrl = process.env['ELECTRON_RENDERER_URL']
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl)
  } else {
    await mainWindow.loadFile(join(import.meta.dirname, '../dist/index.html'))
  }
}

// Auto-update. No-ops silently when unsigned / unconfigured: electron-updater
// only runs against a published build with a `publish` config (see
// electron-builder.yml). Imported dynamically so a missing feed just logs.
async function setupAutoUpdater() {
  try {
    const { autoUpdater } = await import('electron-updater')
    autoUpdater.autoDownload = false
    autoUpdater.on('update-available', (info) => {
      // oxlint-disable-next-line no-console -- surface to app logs
      console.info('[updater] update available:', info.version)
    })
    await autoUpdater.checkForUpdates()
  } catch (err) {
    // Expected in dev / unsigned builds — never block startup.
    // oxlint-disable-next-line no-console -- surface updater skip in app logs
    console.warn('[updater] skipped:', err)
  }
}

app.on('window-all-closed', () => {
  // macOS apps usually stay alive until the user quits explicitly.
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow()
  }
})

app.whenReady().then(() => {
  // Dev-only: runtime CSP injection only reaches the Vite dev server, not the
  // packaged file:// app (see installCsp comment). Production CSP ships in the
  // built index.html via the `prod-csp` vite plugin — so skip the handler
  // entirely in production.
  if (process.env['ELECTRON_RENDERER_URL']) {
    installCsp()
  }
  void createWindow()
  // Production-only: in dev ELECTRON_RENDERER_URL is set and there's no build.
  if (!process.env['ELECTRON_RENDERER_URL']) {
    void setupAutoUpdater()
  }
})
