import type { BaseResult } from 'types'
import { IPC_EVENTS } from 'utils'

class OverlayManager {
  /**
   * 显示全屏分区提示 overlay
   */
  async show(): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.OVERLAY.SHOW)
  }

  /**
   * 隐藏全屏分区提示 overlay
   */
  async hide(): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.OVERLAY.HIDE)
  }
}

export const Overlay = new OverlayManager()
