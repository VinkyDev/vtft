import { BrowserWindow, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { WindowService } from '../services/windowService'

export async function setupWindowHandlers() {
  const windowService = new WindowService()

  // 设置窗口模式
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SET_MODE,
    async (event, mode: 'standard' | 'compact') => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.setWindowMode(window, mode)
    },
  )

  // 获取窗口模式
  ipcMain.handle(
    IPC_EVENTS.WINDOW.GET_MODE,
    async () => {
      return await windowService.getWindowMode()
    },
  )

  // 切换窗口显示/隐藏
  ipcMain.handle(
    IPC_EVENTS.WINDOW.TOGGLE_VISIBILITY,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.toggleVisibility(window)
    },
  )

  // 显示窗口
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SHOW,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.show(window)
    },
  )

  // 隐藏窗口
  ipcMain.handle(
    IPC_EVENTS.WINDOW.HIDE,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.hide(window)
    },
  )
}
