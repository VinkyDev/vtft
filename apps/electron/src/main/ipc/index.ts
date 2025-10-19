import { setupClipboardHandlers } from './clipboardHandlers'
import { setupGlobalShortcutHandlers } from './globalShortcutHandlers'
import { setupWindowHandlers } from './windowHandlers'

export async function ipcInit() {
  await Promise.all([
    setupClipboardHandlers(),
    setupGlobalShortcutHandlers(),
    setupWindowHandlers(),
  ])
}
