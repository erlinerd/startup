// Ambient types for the preload-injected `window.electron` bridge.
// The implementation lives in `electron/preload.ts` (contextBridge.exposeInMainWorld).
export interface ElectronAPI {
  readonly platform: NodeJS.Platform
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
