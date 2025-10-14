import { ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { ClipboardService } from '../services/clipboardService'

export async function setupClipboardHandlers() {
  const clipboardService = new ClipboardService()
  ipcMain.handle(IPC_EVENTS.CLIPBOARD.SET, async (_, text: string) => {
    return await clipboardService.setClipboardText(text)
  })
  ipcMain.handle(IPC_EVENTS.CLIPBOARD.GET, async () => {
    return await clipboardService.getClipboardText()
  })
}
