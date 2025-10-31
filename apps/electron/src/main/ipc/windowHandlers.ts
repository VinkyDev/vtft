import { BrowserWindow, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { WindowService } from '../services/windowService'

export async function setupWindowHandlers() {
  const windowService = new WindowService()

  // 设置窗口模式
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SET_MODE,
    async (event, mode: 'standard' | 'compact' | 'floating') => {
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

  // 拖动窗口
  ipcMain.on(
    IPC_EVENTS.WINDOW.DRAG,
    (event, { dx, dy }: { dx: number, dy: number }) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window)
        return
      const [x, y] = window.getPosition()
      window.setPosition(x + dx, y + dy)
    },
  )

  // 开始拖动
  ipcMain.handle(
    IPC_EVENTS.WINDOW.START_DRAG,
    async () => {
      return await windowService.startDrag()
    },
  )

  // 结束拖动
  ipcMain.handle(
    IPC_EVENTS.WINDOW.END_DRAG,
    async (event, mouseX: number, mouseY: number) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.endDrag(window, mouseX, mouseY)
    },
  )

  // 获取屏幕分区信息
  ipcMain.handle(
    IPC_EVENTS.WINDOW.GET_SCREEN_ZONES,
    async () => {
      return await windowService.getScreenZones()
    },
  )

  // 切换到标准模式并居中
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SWITCH_TO_STANDARD_AND_CENTER,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.switchToStandardAndCenter(window)
    },
  )
}
