import type { BaseResult } from 'types'
import { IPC_EVENTS } from 'utils'

export type WindowMode = 'standard' | 'compact'

class WindowManager {
  /**
   * 设置窗口模式
   * @param mode 窗口模式: 'standard' (标准模式 730x540) 或 'compact' (小窗模式 365x270)
   */
  async setMode(mode: WindowMode): Promise<BaseResult<WindowMode>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.SET_MODE, mode)
  }

  /**
   * 获取当前窗口模式
   */
  async getMode(): Promise<BaseResult<WindowMode>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.GET_MODE)
  }

  /**
   * 切换窗口显示/隐藏状态
   */
  async toggleVisibility(): Promise<BaseResult<boolean>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.TOGGLE_VISIBILITY)
  }

  /**
   * 显示窗口
   */
  async show(): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.SHOW)
  }

  /**
   * 隐藏窗口
   */
  async hide(): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.HIDE)
  }
}

export const Window = new WindowManager()
