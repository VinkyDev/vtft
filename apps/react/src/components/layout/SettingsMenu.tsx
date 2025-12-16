import { App, Update } from 'bridge'
import { Calendar, Check, Clock, Download, LogOut, Package, RefreshCw, Settings } from 'lucide-react'
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
    if (isElectron) {
      App.getVersion().then(setVersion)
    }
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

  const handleExit = () => {
    App.exit()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group p-2 rounded-lg bg-black/30 border border-white/20 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hidden sm:block backdrop-blur-sm"
        >
          <Settings className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors duration-300" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5"
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
          设置
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5 my-1" />

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>
            赛季
          </span>
        </div>

        <div className="px-2 py-1">
          {seasons.map(({ season }) => (
            <DropdownMenuItem
              key={season}
              className={`flex items-center justify-between px-2.5 py-1.5 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
                curSeason === season
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              onSelect={() => setSeason(season)}
            >
              <span className="truncate">{season}</span>
              {curSeason === season && (
                <Check className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-white/5 my-1" />

        {compsUpdatedAt && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              更新于
              {formatRelativeTime(compsUpdatedAt)}
            </span>
          </div>
        )}

        <DropdownMenuItem
          className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg transition-all duration-200 cursor-pointer"
          onSelect={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? '刷新中...' : '刷新数据'}</span>
        </DropdownMenuItem>

        {isElectron && (
          <>
            <DropdownMenuSeparator className="bg-white/5 my-1" />

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500">
              <Package className="h-3 w-3" />
              <span>
                版本
                {' '}
                <span className="text-gray-400 font-mono">
                  v
                  {version}
                </span>
              </span>
            </div>

            <DropdownMenuItem
              className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white rounded-lg transition-all duration-200 cursor-pointer"
              onSelect={handleCheckUpdate}
              disabled={isCheckingUpdate}
            >
              <Download className={`h-3.5 w-3.5 flex-shrink-0 ${isCheckingUpdate ? 'animate-pulse' : ''}`} />
              <span>{isCheckingUpdate ? '检查中...' : '检查更新'}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5 my-1" />

            <DropdownMenuItem
              className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 rounded-lg transition-all duration-200 cursor-pointer"
              onSelect={handleExit}
            >
              <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
              <span>退出应用</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
