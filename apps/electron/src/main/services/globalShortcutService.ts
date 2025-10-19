import type { BaseResult } from 'types'
import { globalShortcut } from 'electron'
import { ResultUtil } from 'utils'

export class GlobalShortcutService {
  private registeredShortcuts = new Map<string, () => void>()

  /**
   * 注册全局快捷键
   * @param accelerator 快捷键组合，例如: 'CommandOrControl+X', 'Alt+Shift+F'
   * @param callback 快捷键触发时的回调函数
   */
  async registerShortcut(
    accelerator: string,
    callback: () => void,
  ): Promise<BaseResult<boolean>> {
    try {
      // 先取消注册已存在的快捷键
      if (this.registeredShortcuts.has(accelerator)) {
        globalShortcut.unregister(accelerator)
      }

      const success = globalShortcut.register(accelerator, callback)

      if (success) {
        this.registeredShortcuts.set(accelerator, callback)
        return ResultUtil.success(true)
      }
      else {
        return ResultUtil.error(`Failed to register shortcut: ${accelerator}`)
      }
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 取消注册指定的全局快捷键
   * @param accelerator 快捷键组合
   */
  async unregisterShortcut(accelerator: string): Promise<BaseResult<void>> {
    try {
      globalShortcut.unregister(accelerator)
      this.registeredShortcuts.delete(accelerator)
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 取消注册所有全局快捷键
   */
  async unregisterAllShortcuts(): Promise<BaseResult<void>> {
    try {
      globalShortcut.unregisterAll()
      this.registeredShortcuts.clear()
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 检查快捷键是否已注册
   * @param accelerator 快捷键组合
   */
  async isRegistered(accelerator: string): Promise<BaseResult<boolean>> {
    try {
      const isRegistered = globalShortcut.isRegistered(accelerator)
      return ResultUtil.success(isRegistered)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 获取所有已注册的快捷键
   */
  getRegisteredShortcuts(): string[] {
    return Array.from(this.registeredShortcuts.keys())
  }
}
