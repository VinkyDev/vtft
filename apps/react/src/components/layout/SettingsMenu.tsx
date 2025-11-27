import { Check, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui'
import { useGlobalStore } from '@/store/globalStore'

export function SettingsMenu() {
  const seasons = useGlobalStore(s => s.seasons)
  const curSeason = useGlobalStore(s => s.curSeason)
  const setSeason = useGlobalStore(s => s.setSeason)
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

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
