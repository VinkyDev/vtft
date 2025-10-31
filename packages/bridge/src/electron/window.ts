import type { BaseResult } from 'types'
import { IPC_EVENTS } from 'utils'

export type WindowMode = 'standard' | 'compact' | 'floating'

class WindowManager {
  /**
   * 设置窗口模式
   * @param mode 窗口模式: 'standard' (标准模式 730x540)、'compact' (小窗模式 365x270) 或 'floating' (悬浮球模式 80x80)
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

  /**
   * 拖动窗口
   * @param dx x 轴偏移量
   * @param dy y 轴偏移量
   */
  drag(dx: number, dy: number): void {
    window.electron.ipcRenderer.send(IPC_EVENTS.WINDOW.DRAG, { dx, dy })
  }

  /**
   * 开始拖动（启用区域检测）
   */
  async startDrag(): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.START_DRAG)
  }

  /**
   * 结束拖动（根据区域自动切换模式）
   * @param mouseX 鼠标的屏幕 X 坐标
   * @param mouseY 鼠标的屏幕 Y 坐标
   */
  async endDrag(mouseX: number, mouseY: number): Promise<BaseResult<WindowMode>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.END_DRAG, mouseX, mouseY)
  }

  /**
   * 获取屏幕分区信息
   */
  async getScreenZones(): Promise<BaseResult<{ leftThird: number, rightThird: number, screenWidth: number }>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.GET_SCREEN_ZONES)
  }

  /**
   * 切换到标准模式并居中
   */
  async switchToStandardAndCenter(): Promise<BaseResult<WindowMode>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.WINDOW.SWITCH_TO_STANDARD_AND_CENTER)
  }
}

export const Window = new WindowManager()
