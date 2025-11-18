import path from 'node:path'
import process from 'node:process'
import { app, Menu, nativeImage, Tray } from 'electron'
import { isDev } from './constants'
import { destroyMainWindow, getMainWindow } from './mainWIndow'

let tray: Tray | null = null

function resolveResource(...p: string[]) {
  if (isDev) {
    return path.join(__dirname, '../../resources', ...p)
  }
  return path.join(app.getAppPath(), 'resources', ...p)
}

/**
 * 创建系统托盘
 */
export function createTray(): void {
  const iconName = process.platform === 'win32' ? '64x64.png' : '32x32.png'
  const iconPath = resolveResource('icons/png', iconName)
  const icon = nativeImage.createFromPath(iconPath)

  tray = new Tray(icon)

  // 设置托盘工具提示
  tray.setToolTip('VTFT')

  // 创建上下文菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        const window = getMainWindow()
        if (window) {
          window.show()
          window.focus()
        }
      },
    },
    {
      label: '隐藏窗口',
      click: () => {
        const window = getMainWindow()
        if (window) {
          window.hide()
        }
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        // 销毁窗口和托盘，然后强制退出应用
        destroyMainWindow()
        if (tray) {
          tray.destroy()
          tray = null
        }
        // 使用 exit 而不是 quit，确保进程立即退出
        app.exit(0)
      },
    },
  ])

  tray.setContextMenu(contextMenu)

  // 点击托盘图标切换窗口显示/隐藏
  tray.on('click', () => {
    if (process.platform === 'darwin')
      return

    const window = getMainWindow()
    if (window) {
      if (!window.isVisible()) {
        window.show()
      }
    }
  })
}
