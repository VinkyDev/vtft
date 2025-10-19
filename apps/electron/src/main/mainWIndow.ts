import { join } from 'node:path'
import { BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { isDev } from './constants'

let mainWindow: BrowserWindow | null = null

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
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow?.on('ready-to-show', () => {
    mainWindow?.show()
    // 设置为最高层级，确保能覆盖游戏窗口
    mainWindow?.setAlwaysOnTop(true, 'screen-saver')
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
