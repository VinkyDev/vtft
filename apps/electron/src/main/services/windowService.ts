import type { BrowserWindow } from 'electron'
import type { BaseResult } from 'types'
import { ResultUtil } from 'utils'

export type WindowMode = 'standard' | 'compact'

interface WindowConfig {
  width: number
  height: number
  x: number
  y: number
}

const WINDOW_CONFIGS: Record<WindowMode, WindowConfig> = {
  standard: {
    width: 730,
    height: 540,
    x: 0,
    y: 0,
  },
  compact: {
    width: 365,
    height: 270,
    x: 0,
    y: 0,
  },
}

export class WindowService {
  private currentMode: WindowMode = 'standard'
  private standardModePosition: { x: number, y: number } | null = null
  private isTogglingVisibility = false
  private toggleTimeout: NodeJS.Timeout | null = null

  /**
   * 设置窗口模式
   */
  async setWindowMode(window: BrowserWindow, mode: WindowMode): Promise<BaseResult<WindowMode>> {
    try {
      const config = WINDOW_CONFIGS[mode]

      // 如果从标准模式切换到小窗模式，保存当前标准模式的位置
      if (this.currentMode === 'standard' && mode === 'compact') {
        const bounds = window.getBounds()
        this.standardModePosition = { x: bounds.x, y: bounds.y }
      }

      // 设置窗口大小和位置
      if (mode === 'compact') {
        // 小窗模式：固定在左上角
        window.setBounds({
          width: config.width,
          height: config.height,
          x: 0,
          y: 0,
        })
      }
      else if (mode === 'standard') {
        // 标准模式：如果有保存的位置就使用保存的位置，否则使用默认位置
        if (this.standardModePosition) {
          window.setBounds({
            width: config.width,
            height: config.height,
            x: this.standardModePosition.x,
            y: this.standardModePosition.y,
          })
        }
        else {
          // 第一次使用标准模式，居中显示
          window.setBounds({
            width: config.width,
            height: config.height,
          })
          window.center()
        }
      }

      this.currentMode = mode
      return ResultUtil.success(mode)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 获取当前窗口模式
   */
  async getWindowMode(): Promise<BaseResult<WindowMode>> {
    try {
      return ResultUtil.success(this.currentMode)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 切换窗口模式
   */
  async toggleWindowMode(window: BrowserWindow): Promise<BaseResult<WindowMode>> {
    const newMode: WindowMode = this.currentMode === 'standard' ? 'compact' : 'standard'
    return this.setWindowMode(window, newMode)
  }

  /**
   * 切换窗口显示/隐藏（带防抖）
   */
  async toggleVisibility(window: BrowserWindow): Promise<BaseResult<boolean>> {
    try {
      // 防止快速连续调用
      if (this.isTogglingVisibility) {
        console.log('[WindowService] Toggle already in progress, ignoring...')
        return ResultUtil.success(window.isVisible())
      }

      // 清除之前的定时器
      if (this.toggleTimeout) {
        clearTimeout(this.toggleTimeout)
      }

      this.isTogglingVisibility = true

      const isVisible = window.isVisible()
      console.log(`[WindowService] Toggling visibility, current state: ${isVisible ? 'visible' : 'hidden'}`)

      if (isVisible) {
        window.hide()
      }
      else {
        window.show()
        window.focus()
      }

      // 300ms 后重置标志
      this.toggleTimeout = setTimeout(() => {
        this.isTogglingVisibility = false
        this.toggleTimeout = null
      }, 300)

      return ResultUtil.success(!isVisible)
    }
    catch (error) {
      this.isTogglingVisibility = false
      return ResultUtil.error(error)
    }
  }

  /**
   * 显示窗口
   */
  async show(window: BrowserWindow): Promise<BaseResult<void>> {
    try {
      window.show()
      window.focus()
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 隐藏窗口
   */
  async hide(window: BrowserWindow): Promise<BaseResult<void>> {
    try {
      window.hide()
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }
}
