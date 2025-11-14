import type { BrowserWindow } from 'electron'
import type { BaseResult } from 'types'
import { BrowserWindow as BrowserWindowClass, screen } from 'electron'
import { ResultUtil } from 'utils'

export class OverlayService {
  private overlayWindow: BrowserWindow | null = null

  /**
   * 创建全屏 overlay 窗口
   */
  private createOverlayWindow(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.bounds

    this.overlayWindow = new BrowserWindowClass({
      width,
      height,
      x: 0,
      y: 0,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      focusable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    // 设置窗口为点击穿透
    this.overlayWindow.setIgnoreMouseEvents(true)
    // 设置为最高层级
    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver', 1)

    // 加载 HTML 内容
    this.overlayWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(this.getOverlayHTML())}`)

    return this.overlayWindow
  }

  /**
   * 获取 overlay 的 HTML 内容
   */
  private getOverlayHTML(): string {
    const primaryDisplay = screen.getPrimaryDisplay()
    const screenWidth = primaryDisplay.bounds.width

    const leftThird = screenWidth / 3
    const rightThird = (screenWidth * 2) / 3
    const SNAP_ZONE_SIZE = 280

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              width: 100vw;
              height: 100vh;
              background: rgba(0, 0, 0, 0.15);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              overflow: hidden;
            }
            .divider {
              position: absolute;
              top: 10%;
              bottom: 10%;
              width: 0;
              border-left: 2px dashed rgba(156, 163, 175, 0.5);
            }
            .divider-1 {
              left: ${leftThird}px;
            }
            .divider-2 {
              left: ${rightThird}px;
            }
            .snap-zone {
              position: absolute;
              top: 0;
              left: 0;
              width: ${SNAP_ZONE_SIZE}px;
              height: ${SNAP_ZONE_SIZE}px;
              border: 2px dashed rgba(156, 163, 175, 0.6);
              border-radius: 12px;
              background: rgba(55, 65, 81, 0.1);
              backdrop-filter: blur(4px);
              -webkit-backdrop-filter: blur(4px);
            }
          </style>
        </head>
        <body>
          <!-- 左上角吸附区域 -->
          <div class="snap-zone"></div>

          <!-- 分割线 -->
          <div class="divider divider-1"></div>
          <div class="divider divider-2"></div>
        </body>
      </html>
    `
  }

  /**
   * 显示 overlay
   */
  async show(): Promise<BaseResult<void>> {
    try {
      if (!this.overlayWindow || this.overlayWindow.isDestroyed()) {
        this.createOverlayWindow()
      }

      this.overlayWindow?.show()
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 隐藏 overlay
   */
  async hide(): Promise<BaseResult<void>> {
    try {
      this.overlayWindow?.hide()
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  /**
   * 销毁 overlay 窗口
   */
  destroy(): void {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.destroy()
      this.overlayWindow = null
    }
  }
}
