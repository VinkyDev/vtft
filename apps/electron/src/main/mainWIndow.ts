import { join } from 'node:path'
import { BrowserWindow, shell } from 'electron'
import icon from '../../resources/icons/png/1024x1024.png?asset'
import { isDev } from './constants'
import { windowService } from './services/windowService'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

/**
 * 获取主窗口
 */
export function getMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow
  }
  return null
}

/**
 * 设置退出标志，允许窗口真正关闭
 */
export function setQuitting(): void {
  isQuitting = true
}

/**
 * 销毁主窗口
 */
export function destroyMainWindow(): void {
  setQuitting()
  if (mainWindow && !mainWindow.isDestroyed()) {
    // 移除所有事件监听器，防止阻止关闭
    mainWindow.removeAllListeners('close')
    // 直接销毁窗口，而不是关闭
    mainWindow.destroy()
    mainWindow = null
  }
}

/**
 * 创建主窗口
 */
export function createWindow(): void {
  // 默认为标准模式：730x540
  mainWindow = new BrowserWindow({
    width: 730,
    height: 540,
    center: true,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true, // 不在任务栏和 Alt+Tab 中显示，但在任务管理器中可见
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow?.on('ready-to-show', async () => {
    if (mainWindow) {
      // 确保窗口是标准模式并居中
      await windowService.switchToStandardAndCenter(mainWindow)

      mainWindow.show()
      // 设置为最高层级，确保能覆盖游戏窗口
      mainWindow.setAlwaysOnTop(true, 'screen-saver')
    }
  })

  // 关闭窗口时隐藏窗口而不是销毁，因为应用在托盘中运行
  // 但如果正在退出应用，则允许真正关闭
  mainWindow?.on('close', (event) => {
    if (!isQuitting && !mainWindow?.isDestroyed()) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow?.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (isDev) {
    mainWindow?.loadURL('http://localhost:5173')
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
