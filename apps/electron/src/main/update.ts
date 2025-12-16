import type { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from 'electron-updater'
import { ipcMain } from 'electron'
import electronUpdater from 'electron-updater'
import logger from 'logger'
import { IPC_EVENTS } from 'utils'
import { getMainWindow } from './mainWIndow'

const { autoUpdater } = electronUpdater
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.forceDevUpdateConfig = true

function sendToRenderer(channel: string, data?: unknown) {
  const mainWindow = getMainWindow()
  if (mainWindow) {
    mainWindow.webContents.send(channel, data)
  }
}

export function setupAutoUpdater() {
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    logger.info(`发现新版本: ${info.version}，开始自动下载...`)
    sendToRenderer(IPC_EVENTS.UPDATE.AVAILABLE, { version: info.version })
  })

  autoUpdater.on('update-not-available', () => {
    logger.info('当前已是最新版本')
    sendToRenderer(IPC_EVENTS.UPDATE.NOT_AVAILABLE)
  })

  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    sendToRenderer(IPC_EVENTS.UPDATE.PROGRESS, {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    })
  })

  autoUpdater.on('update-downloaded', (_event: UpdateDownloadedEvent) => {
    logger.info('更新下载完成')
    sendToRenderer(IPC_EVENTS.UPDATE.DOWNLOADED)
  })

  autoUpdater.on('error', (error: Error) => {
    logger.error('更新检查失败', error)
    sendToRenderer(IPC_EVENTS.UPDATE.ERROR, { message: error.message })
  })

  ipcMain.on(IPC_EVENTS.UPDATE.INSTALL, () => {
    setImmediate(() => autoUpdater.quitAndInstall(false, true))
  })

  ipcMain.on(IPC_EVENTS.UPDATE.CHECK, () => {
    checkForUpdate()
  })
}

export async function checkForUpdate() {
  try {
    logger.info('正在检查更新...')
    await autoUpdater.checkForUpdatesAndNotify({
      title: 'VTFT 更新就绪',
      body: '新版本已下载完成，重启应用后生效',
    })
  }
  catch (error) {
    logger.warn(`检查更新失败: ${(error as Error).message}`)
  }
}
