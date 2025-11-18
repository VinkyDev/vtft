import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Switch,
} from 'ui'
import { useConfigStore } from '@/store/configStore'

export function SettingsMenu() {
  const { tooltipConfig, setTooltipConfig } = useConfigStore()

  const handleChampionTooltipChange = (checked: boolean) => {
    setTooltipConfig({ championTooltip: checked })
  }

  const handleItemTooltipChange = (checked: boolean) => {
    setTooltipConfig({ itemTooltip: checked })
  }

  const handleTraitTooltipChange = (checked: boolean) => {
    setTooltipConfig({ traitTooltip: checked })
  }

  const handleSwitchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
          显示设置
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
          onSelect={e => e.preventDefault()}
        >
          <span>英雄名称悬浮提示</span>
          <div onClick={handleSwitchClick}>
            <Switch
              checked={tooltipConfig.championTooltip}
              onCheckedChange={handleChampionTooltipChange}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
          onSelect={e => e.preventDefault()}
        >
          <span>装备名称悬浮提示</span>
          <div onClick={handleSwitchClick}>
            <Switch
              checked={tooltipConfig.itemTooltip}
              onCheckedChange={handleItemTooltipChange}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 focus:bg-white/5 focus:text-white transition-colors"
          onSelect={e => e.preventDefault()}
        >
          <span>羁绊名称悬浮提示</span>
          <div onClick={handleSwitchClick}>
            <Switch
              checked={tooltipConfig.traitTooltip}
              onCheckedChange={handleTraitTooltipChange}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
