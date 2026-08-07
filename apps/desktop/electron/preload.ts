import { contextBridge } from 'electron'

// Bridge between the sandboxed renderer and the Node/Electron main process.
// Expose a minimal, typed API — never expose `require`, ipcRenderer raw, or fs.
export interface ElectronAPI {
  readonly platform: NodeJS.Platform
}

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
} satisfies ElectronAPI)
