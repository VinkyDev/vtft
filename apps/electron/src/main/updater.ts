import type { BrowserWindow } from 'electron'
import { app, dialog } from 'electron'
import pkg from 'electron-updater'
import logger from 'logger'

const { autoUpdater } = pkg

autoUpdater.autoDownload = false // 不自动下载
autoUpdater.autoInstallOnAppQuit = true // 退出时自动安装

/**
 * 初始化自动更新
 */
export function initUpdater(mainWindow: BrowserWindow | null) {
  // 开发环境下跳过更新检查
  if (process.env.NODE_ENV === 'development') {
    logger.info('开发环境，跳过自动更新检查')
    return
  }

  // 检查更新错误
  autoUpdater.on('error', (error) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: '更新错误',
        message: '检查更新时出现错误',
        detail: error.message,
        buttons: ['确定'],
      })
    }
  })

  // 检查更新中
  autoUpdater.on('checking-for-update', () => {
    logger.info('正在检查更新...')
  })

  // 有可用更新
  autoUpdater.on('update-available', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '发现新版本',
          message: `发现新版本 ${info.version}`,
          detail: `当前版本: ${app.getVersion()}\n新版本: ${info.version}\n\n是否立即下载更新？`,
          buttons: ['立即下载', '稍后提醒'],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            // 开始下载更新
            autoUpdater.downloadUpdate()
          }
        })
    }
  })

  // 下载进度
  autoUpdater.on('download-progress', (progressInfo) => {
    const percent = progressInfo.percent.toFixed(2)
    logger.info(`下载进度: ${percent}%`)

    // 可以通过 IPC 发送进度到渲染进程
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('download-progress', {
        percent,
        transferred: progressInfo.transferred,
        total: progressInfo.total,
        bytesPerSecond: progressInfo.bytesPerSecond,
      })
    }
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: '更新下载完成',
          message: `新版本 ${info.version} 已下载完成`,
          detail: '是否立即重启应用安装更新？',
          buttons: ['立即重启', '稍后重启'],
          defaultId: 0,
          cancelId: 1,
        })
        .then((result) => {
          if (result.response === 0) {
            // 退出并安装更新
            setImmediate(() => {
              autoUpdater.quitAndInstall(false, true)
            })
          }
        })
    }
  })

  // 应用启动后 3 秒检查更新
  setTimeout(() => {
    checkForUpdates()
  }, 3000)
}

/**
 * 手动检查更新
 */
export function checkForUpdates() {
  if (process.env.NODE_ENV === 'development') {
    logger.info('开发环境，跳过更新检查')
    return
  }

  logger.info('开始检查更新...')
  autoUpdater.checkForUpdates().catch((error) => {
    logger.error({ message: '检查更新失败:', error })
  })
}

/**
 * 手动下载更新
 */
export function downloadUpdate() {
  if (process.env.NODE_ENV === 'development') {
    logger.info('开发环境，跳过下载更新')
    return
  }

  logger.info('开始下载更新...')
  autoUpdater.downloadUpdate().catch((error) => {
    logger.error({ message: '下载更新失败:', error })
  })
}

/**
 * 立即安装更新
 */
export function quitAndInstall() {
  logger.info('退出并安装更新...')
  autoUpdater.quitAndInstall(false, true)
}
