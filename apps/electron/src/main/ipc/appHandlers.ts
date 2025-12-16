import { app, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { exitApp } from '../tray'

export async function setupAppHandlers() {
  ipcMain.handle(IPC_EVENTS.APP.GET_VERSION, () => {
    return app.getVersion()
  })

  ipcMain.handle(IPC_EVENTS.APP.EXIT, () => {
    exitApp()
  })
}
