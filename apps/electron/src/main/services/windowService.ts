import type { BrowserWindow } from 'electron'
import type { BaseResult } from 'types'
import { screen } from 'electron'
import { ResultUtil } from 'utils'

export type WindowMode = 'standard' | 'compact' | 'floating'

export type ScreenZone = 'left' | 'center' | 'right'

interface WindowConfig {
  width: number
  height: number
}

const WINDOW_CONFIGS: Record<WindowMode, WindowConfig> = {
  standard: {
    width: 730,
    height: 540,
  },
  compact: {
    width: 365,
    height: 270,
  },
  floating: {
    width: 40,
    height: 40,
  },
}

export class WindowService {
  private currentMode: WindowMode = 'standard'
  private isTogglingVisibility = false
  private toggleTimeout: NodeJS.Timeout | null = null
  private isDragging = false

  /**
   * 检查鼠标是否在左上角吸附区域内
   * 吸附区域：左上角 280x280 的区域
   */
  private isInSnapZone(mouseX: number, mouseY: number): boolean {
    const SNAP_ZONE_SIZE = 280
    return mouseX <= SNAP_ZONE_SIZE && mouseY <= SNAP_ZONE_SIZE
  }

  /**
   * 获取窗口中心点所在的屏幕区域
   */
  private getScreenZone(window: BrowserWindow): ScreenZone {
    const bounds = window.getBounds()
    const centerX = bounds.x + bounds.width / 2

    const primaryDisplay = screen.getPrimaryDisplay()
    const screenWidth = primaryDisplay.bounds.width

    const leftThird = screenWidth / 3
    const rightThird = (screenWidth * 2) / 3

    if (centerX < leftThird) {
      return 'left'
    }
    else if (centerX > rightThird) {
      return 'right'
    }
    else {
      return 'center'
    }
  }

  /**
   * 根据屏幕区域获取对应的窗口模式
   */
  private getModeByScreenZone(zone: ScreenZone): WindowMode {
    switch (zone) {
      case 'left':
        return 'compact'
      case 'center':
        return 'standard'
      case 'right':
        return 'floating'
    }
  }

  /**
   * 设置窗口模式（保持水平中心点不变）
   */
  async setWindowMode(window: BrowserWindow, mode: WindowMode, mouseX?: number): Promise<BaseResult<WindowMode>> {
    try {
      const config = WINDOW_CONFIGS[mode]
      const bounds = window.getBounds()
      const fromMode = this.currentMode

      // 如果模式没有变化，直接返回
      if (fromMode === mode) {
        return ResultUtil.success(mode)
      }

      let targetX: number
      let targetY: number

      // 切换到悬浮球模式：鼠标位置作为悬浮球中心
      if (mode === 'floating' && mouseX !== undefined) {
        targetX = mouseX - config.width / 2
        targetY = bounds.y
      }
      // 从悬浮球切换到其他模式：保持水平中心点不变
      else if (fromMode === 'floating' && mode !== 'floating') {
        const currentCenterX = bounds.x + bounds.width / 2
        targetX = currentCenterX - config.width / 2
        targetY = bounds.y
      }
      // 其他模式之间切换：保持水平中心点不变
      else {
        const currentCenterX = bounds.x + bounds.width / 2
        targetX = currentCenterX - config.width / 2
        targetY = bounds.y
      }

      // 使用 setContentBounds 而不是 setBounds，避免触发渲染进程重载
      // 同时使用 animate: false 禁用动画，避免视觉跳变
      window.setBounds(
        {
          width: config.width,
          height: config.height,
          x: Math.round(targetX),
          y: Math.round(targetY),
        },
        false, // animate = false，禁用动画
      )

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
   * 切换窗口模式（循环切换）
   */
  async toggleWindowMode(window: BrowserWindow): Promise<BaseResult<WindowMode>> {
    const modes: WindowMode[] = ['standard', 'compact', 'floating']
    const currentIndex = modes.indexOf(this.currentMode)
    const newMode = modes[(currentIndex + 1) % modes.length]
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

  /**
   * 开始拖动
   */
  async startDrag(): Promise<BaseResult<void>> {
    try {
      this.isDragging = true
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 结束拖动，根据窗口位置自动切换模式
   */
  async endDrag(window: BrowserWindow, mouseX: number, mouseY: number): Promise<BaseResult<WindowMode>> {
    try {
      this.isDragging = false

      // 检查是否在左上角吸附区域
      const inSnapZone = this.isInSnapZone(mouseX, mouseY)

      // 获取窗口所在的屏幕区域
      const zone = this.getScreenZone(window)
      const targetMode = this.getModeByScreenZone(zone)

      // 如果目标模式与当前模式不同，切换模式
      if (targetMode !== this.currentMode) {
        const result = await this.setWindowMode(window, targetMode, mouseX)

        // 如果在吸附区域且是小窗模式，吸附到左上角
        if (result.success && inSnapZone && targetMode === 'compact') {
          window.setPosition(0, 0)
        }

        return result
      }

      // 当前模式不变，但如果在吸附区域且是小窗模式，也要吸附
      if (inSnapZone && this.currentMode === 'compact') {
        window.setPosition(0, 0)
      }

      return ResultUtil.success(this.currentMode)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 获取拖动状态
   */
  async isDraggingWindow(): Promise<BaseResult<boolean>> {
    try {
      return ResultUtil.success(this.isDragging)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 获取屏幕分区信息（用于前端显示虚线）
   */
  async getScreenZones(): Promise<BaseResult<{ leftThird: number, rightThird: number, screenWidth: number }>> {
    try {
      const primaryDisplay = screen.getPrimaryDisplay()
      const screenWidth = primaryDisplay.bounds.width
      const leftThird = screenWidth / 3
      const rightThird = (screenWidth * 2) / 3

      return ResultUtil.success({ leftThird, rightThird, screenWidth })
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 切换到标准模式并居中
   */
  async switchToStandardAndCenter(window: BrowserWindow): Promise<BaseResult<WindowMode>> {
    try {
      const config = WINDOW_CONFIGS.standard

      // 设置为标准模式尺寸，禁用动画避免跳变
      window.setBounds(
        {
          width: config.width,
          height: config.height,
        },
        false,
      )

      // 居中显示
      window.center()

      this.currentMode = 'standard'

      return ResultUtil.success('standard')
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }
}

// 导出单例实例
export const windowService = new WindowService()
