import type { Champion } from 'types'
import { memo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'

interface ChampionIconProps {
  champion: Champion
}

function getCostColor(cost: number) {
  switch (cost) {
    case 1: return { border: 'border-gray-500', bg: 'bg-gray-500' }
    case 2: return { border: 'border-green-500', bg: 'bg-green-500' }
    case 3: return { border: 'border-blue-500', bg: 'bg-blue-500' }
    case 4: return { border: 'border-purple-500', bg: 'bg-purple-500' }
    case 5: return { border: 'border-yellow-500', bg: 'bg-yellow-500' }
    default: return { border: 'border-gray-500', bg: 'bg-gray-500' }
  }
}

export const ChampionIcon = memo(({ champion }: ChampionIconProps) => {
  const costColors = getCostColor(champion.cost)

  return (
    <div className="flex flex-col items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative h-7 w-9 overflow-hidden rounded border-2 ${costColors.border} bg-black/40 transition-all hover:scale-110 hover:shadow-lg`}>
            {champion.icon
              ? (
                  <img
                    src={champion.icon}
                    alt={champion.name}
                    className="h-full w-full object-cover"
                  />
                )
              : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
                )}

            {/* 优先级标识 */}
            {champion.priority && (
              <div className={`absolute left-0 top-0 ${costColors.bg} px-0.5 text-[7px] rounded-[2px_2px_4px_2px] font-bold leading-none text-white`}>
                {champion.priority}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-black/90 text-white border-white/10"
        >
          <span className="font-semibold">{champion.name}</span>
        </TooltipContent>
      </Tooltip>

      {/* 装备图标 - 显示在英雄下方 */}
      {champion.items && champion.items.length > 0 && (
        <div className="flex gap-0.5">
          {champion.items.slice(0, 3).map((item, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-3 w-3 rounded border border-gray-600 bg-black/60 object-cover"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/90 text-white border-white/10 text-xs">
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  )
})

ChampionIcon.displayName = 'ChampionIcon'
