import { app, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'

export async function setupAppHandlers() {
  ipcMain.handle(IPC_EVENTS.APP.GET_VERSION, () => {
    return app.getVersion()
  })
}
