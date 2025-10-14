import { setupClipboardHandlers } from './clipboardHandlers'

export async function ipcInit() {
  await Promise.all([
    setupClipboardHandlers(),
  ])
}
