import type { BaseResult } from 'types'
import { IPC_EVENTS } from 'utils'

type ShortcutCallback = () => void

class GlobalShortcutManager {
  private eventListeners = new Map<string, ShortcutCallback[]>()

  /**
   * 注册全局快捷键
   * @param accelerator 快捷键组合，例如: 'CommandOrControl+X', 'Alt+Shift+F'
   * @param eventName 事件名称，用于标识这个快捷键
   * @param callback 快捷键触发时的回调函数
   * @example
   * ```typescript
   * GlobalShortcut.register('CommandOrControl+Shift+K', 'open-search', () => {
   *   console.log('Search shortcut triggered!')
   * })
   * ```
   */
  async register(
    accelerator: string,
    eventName: string,
    callback: ShortcutCallback,
  ): Promise<BaseResult<boolean>> {
    // 先清理同名事件的旧监听器，避免重复注册
    const existingListeners = this.eventListeners.get(eventName)
    if (existingListeners) {
      existingListeners.forEach((listener) => {
        window.electron.ipcRenderer.removeListener(
          `global-shortcut-triggered:${eventName}`,
          listener,
        )
      })
      this.eventListeners.delete(eventName)
    }

    const result = await window.electron.ipcRenderer.invoke(
      IPC_EVENTS.GLOBAL_SHORTCUT.REGISTER,
      accelerator,
      eventName,
    )

    if (result.success) {
      // 保存回调函数
      this.eventListeners.set(eventName, [callback])

      // 监听来自主进程的事件
      window.electron.ipcRenderer.on(
        `global-shortcut-triggered:${eventName}`,
        callback,
      )
    }

    return result
  }

  /**
   * 取消注册指定的全局快捷键
   * @param accelerator 快捷键组合
   * @param eventName 事件名称（可选，如果提供则同时移除对应的事件监听器）
   */
  async unregister(
    accelerator: string,
    eventName?: string,
  ): Promise<BaseResult<void>> {
    const result = await window.electron.ipcRenderer.invoke(
      IPC_EVENTS.GLOBAL_SHORTCUT.UNREGISTER,
      accelerator,
    )

    if (result.success && eventName) {
      // 移除事件监听器
      const listeners = this.eventListeners.get(eventName)
      if (listeners) {
        listeners.forEach((listener) => {
          window.electron.ipcRenderer.removeListener(
            `global-shortcut-triggered:${eventName}`,
            listener,
          )
        })
        this.eventListeners.delete(eventName)
      }
    }

    return result
  }

  /**
   * 取消注册所有全局快捷键
   */
  async unregisterAll(): Promise<BaseResult<void>> {
    const result = await window.electron.ipcRenderer.invoke(
      IPC_EVENTS.GLOBAL_SHORTCUT.UNREGISTER_ALL,
    )

    if (result.success) {
      // 移除所有事件监听器
      this.eventListeners.forEach((listeners, eventName) => {
        listeners.forEach((listener) => {
          window.electron.ipcRenderer.removeListener(
            `global-shortcut-triggered:${eventName}`,
            listener,
          )
        })
      })
      this.eventListeners.clear()
    }

    return result
  }

  /**
   * 检查快捷键是否已注册
   * @param accelerator 快捷键组合
   */
  async isRegistered(accelerator: string): Promise<BaseResult<boolean>> {
    return window.electron.ipcRenderer.invoke(
      IPC_EVENTS.GLOBAL_SHORTCUT.IS_REGISTERED,
      accelerator,
    )
  }
}

export const GlobalShortcut = new GlobalShortcutManager()
