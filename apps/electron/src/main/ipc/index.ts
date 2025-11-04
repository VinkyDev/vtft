import logger from 'logger/client'
import { setupClipboardHandlers } from './clipboardHandlers'
import { setupGlobalShortcutHandlers } from './globalShortcutHandlers'
import { setupOverlayHandlers } from './overlayHandlers'
import { setupWindowHandlers } from './windowHandlers'

export async function ipcInit() {
  await Promise.all([
    setupClipboardHandlers(),
    setupGlobalShortcutHandlers(),
    setupWindowHandlers(),
    setupOverlayHandlers(),
  ])
  logger.success({
    namespace: 'Ipc',
    scope: 'ipcInit',
    message: 'initialized',
  })
}
