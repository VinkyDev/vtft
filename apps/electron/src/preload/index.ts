import process from 'node:process'
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import logger from 'logger'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  }
  catch (error) {
    logger.error({ message: '[Preload] Failed to expose Electron APIs', error })
  }
}
else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
