import { initialize, trackEvent } from '@aptabase/electron/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import logger from 'logger'
import { ipcInit } from './ipc/index'
import { createWindow, getMainWindow } from './mainWIndow'
import { createTray } from './tray'
import { initUpdater } from './updater'
import { getDeviceId } from './utils/deviceId'

const aptabaseCode = import.meta.env.VITE_APTABASE_CODE || ''

if (aptabaseCode) {
  initialize(aptabaseCode)
    .then(() => {
      logger.info('Aptabase initialization completed')
    })
}

app.whenReady().then(() => {
  trackEvent('app_start', {
    device_id: getDeviceId(),
  })
  electronApp.setAppUserModelId('com.vtft.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcInit()

  createWindow()
  createTray() // 创建系统托盘

  const mainWindow = getMainWindow()
  initUpdater(mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// 监听应用退出事件
app.on('will-quit', () => {
  trackEvent('app_quit', {
    device_id: getDeviceId(),
  })
})
