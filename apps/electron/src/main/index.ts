import { initialize, trackEvent } from '@aptabase/electron/main'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import logger from 'logger'
import { ipcInit } from './ipc/index'
import { createWindow } from './mainWIndow'
import { createTray } from './tray'
import { checkForUpdate } from './update'
import { markReportedToday, shouldReportToday } from './utils/dailyReport'

const aptabaseCode = import.meta.env.VITE_APTABASE_CODE || ''

if (aptabaseCode) {
  initialize(aptabaseCode)
    .then(() => {
      logger.info('Aptabase initialization completed')
    })
}

app.whenReady().then(() => {
  trackEvent('app_start')

  if (shouldReportToday()) {
    trackEvent('daily_active_user')
    markReportedToday()
  }

  electronApp.setAppUserModelId('com.vtft.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcInit()

  createWindow()
  createTray()
  checkForUpdate()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

app.on('will-quit', () => {
  trackEvent('app_quit')
})
