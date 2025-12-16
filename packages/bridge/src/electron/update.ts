import { IPC_EVENTS } from 'utils'

export interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

export interface UpdateAvailableInfo {
  version: string
}

export interface UpdateErrorInfo {
  message: string
}

type UpdateCallback<T = void> = (data: T) => void

class UpdateManager {
  onUpdateAvailable(callback: UpdateCallback<UpdateAvailableInfo>): () => void {
    const handler = (_event: unknown, data: UpdateAvailableInfo): void => callback(data)
    return window.electron.ipcRenderer.on(IPC_EVENTS.UPDATE.AVAILABLE, handler)
  }

  onUpdateNotAvailable(callback: UpdateCallback): () => void {
    const handler = (): void => callback()
    return window.electron.ipcRenderer.on(IPC_EVENTS.UPDATE.NOT_AVAILABLE, handler)
  }

  onUpdateProgress(callback: UpdateCallback<UpdateProgress>): () => void {
    const handler = (_event: unknown, data: UpdateProgress): void => callback(data)
    return window.electron.ipcRenderer.on(IPC_EVENTS.UPDATE.PROGRESS, handler)
  }

  onUpdateDownloaded(callback: UpdateCallback): () => void {
    const handler = (): void => callback()
    return window.electron.ipcRenderer.on(IPC_EVENTS.UPDATE.DOWNLOADED, handler)
  }

  onUpdateError(callback: UpdateCallback<UpdateErrorInfo>): () => void {
    const handler = (_event: unknown, data: UpdateErrorInfo): void => callback(data)
    return window.electron.ipcRenderer.on(IPC_EVENTS.UPDATE.ERROR, handler)
  }

  install(): void {
    window.electron.ipcRenderer.send(IPC_EVENTS.UPDATE.INSTALL)
  }

  check(): void {
    window.electron.ipcRenderer.send(IPC_EVENTS.UPDATE.CHECK)
  }
}

export const Update = new UpdateManager()
