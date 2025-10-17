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
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow?.on('ready-to-show', () => {
    mainWindow?.show()
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
