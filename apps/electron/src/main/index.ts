import { initialize, trackEvent } from '@aptabase/electron/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import logger from 'logger'
import { ipcInit } from './ipc/index'
import { createWindow, onWindowReady } from './mainWIndow'
import { createTray } from './tray'
import { checkForUpdate, setupAutoUpdater } from './update'

const aptabaseCode = import.meta.env.VITE_APTABASE_CODE || ''

if (aptabaseCode) {
  initialize(aptabaseCode)
    .then(() => {
      logger.info('Aptabase initialization completed')
    })
}

app.whenReady().then(async () => {
  trackEvent('app_start')
  electronApp.setAppUserModelId('com.vtft.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await ipcInit()
  setupAutoUpdater()

  onWindowReady(() => {
    checkForUpdate()
  })

  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})
