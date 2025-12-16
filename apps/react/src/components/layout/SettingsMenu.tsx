import { App, Update } from 'bridge'
import { Check, Clock, Download, RefreshCw, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui'
import { formatRelativeTime } from 'utils'
import { useGlobalStore } from '@/store/globalStore'

export function SettingsMenu() {
  const seasons = useGlobalStore(s => s.seasons)
  const curSeason = useGlobalStore(s => s.curSeason)
  const setSeason = useGlobalStore(s => s.setSeason)
  const refreshData = useGlobalStore(s => s.refreshData)
  const compsUpdatedAt = useGlobalStore(s => s.compsUpdatedAt)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [version, setVersion] = useState('')
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)

  const isElectron = typeof window.electron !== 'undefined'

  useEffect(() => {
    if (!isElectron)
      return
    App.getVersion().then(setVersion)
  }, [isElectron])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshData()
    }
    finally {
      setIsRefreshing(false)
    }
  }

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true)
    Update.check()
    setTimeout(() => setIsCheckingUpdate(false), 3000)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group p-2 rounded-md bg-black/30 border border-white/20 hover:bg-black/40 hover:border-white/30 transition-all duration-200 hidden sm:block"
        >
          <Settings className="h-4 w-4 text-gray-400 group-hover:text-gray-200 transition-colors duration-200" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-900 border border-white/20 rounded-lg shadow-lg p-1"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-200">
          设置
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-400">
          赛季
        </DropdownMenuLabel>
        {seasons.map(({ season }) => (
          <DropdownMenuItem
            key={season}
            className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
            onSelect={() => setSeason(season)}
          >
            <span className="truncate">{season}</span>
            {curSeason === season && (
              <Check className="h-4 w-4 text-gray-400" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-white/10" />

        {compsUpdatedAt && (
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              数据更新于
              {formatRelativeTime(compsUpdatedAt)}
            </span>
          </div>
        )}

        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
          onSelect={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? '刷新中...' : '刷新数据'}</span>
        </DropdownMenuItem>

        {isElectron && (
          <>
            <DropdownMenuSeparator className="bg-white/10" />

            <div className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-500">
              <span>
                版本 v
                {version}
              </span>
            </div>

            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
              onSelect={handleCheckUpdate}
              disabled={isCheckingUpdate}
            >
              <Download className={`h-4 w-4 ${isCheckingUpdate ? 'animate-pulse' : ''}`} />
              <span>{isCheckingUpdate ? '检查中...' : '检查更新'}</span>
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
