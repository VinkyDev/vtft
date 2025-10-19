import { BrowserWindow, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { GlobalShortcutService } from '../services/globalShortcutService'

// 创建单例服务实例
const globalShortcutService = new GlobalShortcutService()

export async function setupGlobalShortcutHandlers() {
  // 注册全局快捷键
  ipcMain.handle(
    IPC_EVENTS.GLOBAL_SHORTCUT.REGISTER,
    async (event, accelerator: string, eventName: string) => {
      // 创建回调函数，触发时向渲染进程发送事件
      const callback = () => {
        const window = BrowserWindow.fromWebContents(event.sender)
        if (window && !window.isDestroyed() && !event.sender.isDestroyed()) {
          event.sender.send(`global-shortcut-triggered:${eventName}`)
        }
      }

      return await globalShortcutService.registerShortcut(accelerator, callback)
    },
  )

  // 取消注册快捷键
  ipcMain.handle(
    IPC_EVENTS.GLOBAL_SHORTCUT.UNREGISTER,
    async (_, accelerator: string) => {
      return await globalShortcutService.unregisterShortcut(accelerator)
    },
  )

  // 取消注册所有快捷键
  ipcMain.handle(
    IPC_EVENTS.GLOBAL_SHORTCUT.UNREGISTER_ALL,
    async () => {
      return await globalShortcutService.unregisterAllShortcuts()
    },
  )

  // 检查快捷键是否已注册
  ipcMain.handle(
    IPC_EVENTS.GLOBAL_SHORTCUT.IS_REGISTERED,
    async (_, accelerator: string) => {
      return await globalShortcutService.isRegistered(accelerator)
    },
  )
}
