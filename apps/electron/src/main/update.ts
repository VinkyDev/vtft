import { app, dialog, shell } from 'electron'
import logger from 'logger'

type ArchKey = 'x64' | 'arm64'
type PlatformKey = 'windows' | 'macos'

interface LatestFile {
  url: string
}

interface LatestJson {
  version: string
  notes?: string
  files?: Partial<Record<PlatformKey, Partial<Record<ArchKey, LatestFile>>>>
}

export const LATEST_URL = 'https://static-host-ggr87o43-vtft.sealosgzg.site/latest.json'

function parseVersion(version: string): number[] {
  return version
    .split('.')
    .map(part => Number.parseInt(part, 10))
    .filter(num => Number.isFinite(num))
}

function isRemoteNewer(remote: string, local: string): boolean {
  const remoteParts = parseVersion(remote)
  const localParts = parseVersion(local)
  const maxLength = Math.max(remoteParts.length, localParts.length)
  for (let i = 0; i < maxLength; i += 1) {
    const r = remoteParts[i] ?? 0
    const l = localParts[i] ?? 0
    if (r > l)
      return true
    if (r < l)
      return false
  }
  return false
}


export async function checkForUpdate() {
  try {
    const res = await fetch(LATEST_URL, { cache: 'no-store' })
    if (!res.ok)
      throw new Error(`fetch latest failed: ${res.status}`)
    const latest = (await res.json()) as LatestJson

    const localVersion = app.getVersion()
    if (!isRemoteNewer(latest.version, localVersion))
      return

    const targetUrl = 'https://vinkydev.github.io/vtft/'

    const notes = latest.notes?.trim()
    const detail = notes
      ? `更新内容：\n${notes.split('\n').map(line => `  • ${line.trim()}`).join('\n')}`
      : '前往官网下载并覆盖安装最新版本。'

    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['前往下载', '稍后提醒'],
      defaultId: 0,
      cancelId: 1,
      title: '更新提示',
      message: `发现新版本`,
      detail: `当前版本：${localVersion}\n最新版本：${latest.version}\n\n${detail}`,
      noLink: true,
    })

    if (response === 0) {
      shell.openExternal(targetUrl)
    }
  }
  catch (error) {
    logger.warn(`检查更新失败: ${(error as Error).message}`)
  }
}
