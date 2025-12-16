import { IPC_EVENTS } from 'utils'

class AppManager {
  async getVersion(): Promise<string> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.APP.GET_VERSION)
  }

  async exit(): Promise<void> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.APP.EXIT)
  }
}

export const App = new AppManager()
