import { ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { OverlayService } from '../services/overlayService'

export async function setupOverlayHandlers() {
  const overlayService = new OverlayService()

  // 显示 overlay
  ipcMain.handle(
    IPC_EVENTS.OVERLAY.SHOW,
    async () => {
      return await overlayService.show()
    },
  )

  // 隐藏 overlay
  ipcMain.handle(
    IPC_EVENTS.OVERLAY.HIDE,
    async () => {
      return await overlayService.hide()
    },
  )
}
