import logger from 'logger'
import { setupAppHandlers } from './appHandlers'
import { setupClipboardHandlers } from './clipboardHandlers'
import { setupGlobalShortcutHandlers } from './globalShortcutHandlers'
import { setupOverlayHandlers } from './overlayHandlers'
import { setupWindowHandlers } from './windowHandlers'

export async function ipcInit() {
  await Promise.all([
    setupAppHandlers(),
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
