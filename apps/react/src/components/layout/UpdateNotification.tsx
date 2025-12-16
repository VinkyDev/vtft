import type { UpdateAvailableInfo, UpdateProgress } from 'bridge'
import { Update } from 'bridge'
import { Download, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Progress } from 'ui'

type UpdateStatus = 'idle' | 'available' | 'downloading' | 'downloaded'

export function UpdateNotification() {
  const [status, setStatus] = useState<UpdateStatus>('idle')
  const [version, setVersion] = useState('')
  const [progress, setProgress] = useState<UpdateProgress | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window.electron === 'undefined')
      return

    const cleanups = [
      Update.onUpdateAvailable((info: UpdateAvailableInfo) => {
        setVersion(info.version)
        setStatus('available')
        setDismissed(false)
      }),
      Update.onUpdateProgress((data: UpdateProgress) => {
        setStatus('downloading')
        setProgress(data)
      }),
      Update.onUpdateDownloaded(() => {
        setStatus('downloaded')
        setProgress(null)
      }),
      Update.onUpdateError(() => {
        setStatus('idle')
        setProgress(null)
      }),
    ]

    return () => cleanups.forEach(cleanup => cleanup())
  }, [])

  if (status === 'idle' || dismissed)
    return null

  const handleInstall = () => {
    Update.install()
  }

  const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond > 1024 * 1024) {
      return `${(bytesPerSecond / 1024 / 1024).toFixed(1)} MB/s`
    }
    return `${(bytesPerSecond / 1024).toFixed(0)} KB/s`
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-900/95 backdrop-blur border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {status === 'downloading'
              ? <Download className="h-4 w-4 text-blue-400 animate-bounce" />
              : <RefreshCw className="h-4 w-4 text-emerald-400" />}
          </div>

          <div className="flex-1 min-w-0">
            {status === 'available' && (
              <p className="text-sm text-gray-200">
                发现新版本
                {' '}
                <span className="text-emerald-400 font-medium">{version}</span>
              </p>
            )}

            {status === 'downloading' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">正在下载更新...</span>
                  {progress && (
                    <span className="text-gray-400">
                      {progress.percent.toFixed(0)}
                      % ·
                      {formatSpeed(progress.bytesPerSecond)}
                    </span>
                  )}
                </div>
                <Progress value={progress?.percent ?? 0} className="h-1" />
              </div>
            )}

            {status === 'downloaded' && (
              <div>
                <p className="text-sm text-gray-200">新版本已就绪</p>
                <p className="text-xs text-gray-500">点击重启后自动安装新版本</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {status === 'downloaded' && (
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-500"
              >
                立即重启
              </Button>
            )}
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
