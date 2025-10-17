import type { ChampionMeta } from 'types'
import { memo } from 'react'
import { Popover, PopoverContent, PopoverTrigger, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion } from '../../../components'
import { ChampionStats } from './ChampionStats'

interface ChampionDetailPopoverProps {
  /** 英雄数据 */
  champion: ChampionMeta
  /** 触发器元素 */
  children: React.ReactNode
}

/**
 * 英雄详情弹窗组件
 * 显示英雄的完整信息，包括费用、羁绊、统计数据等
 */
export const ChampionDetailPopover = memo(({ champion, children }: ChampionDetailPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-36 p-2 bg-black/95 border-white/10 text-white"
        side="right"
        align="start"
      >
        <div className="flex flex-col items-center space-y-1.5">

          <div className="relative mx-auto mb-1 overflow-hidden rounded border border-white/10 bg-black/20">
            <Champion className="!size-10" championName={champion.name} showTooltip={false} />
          </div>
          <h3 className="font-medium text-[10px] text-white truncate">
            {champion.name}
          </h3>

          {/* 羁绊信息 */}
          {champion.traits && champion.traits.length > 0 && (
            <div className="border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-0.5">
                {champion.traits.map((trait, index) => (
                  <Tooltip key={`${trait.name}-${index}`}>
                    <TooltipTrigger asChild>
                      <div className="size-5 overflow-hidden rounded border border-white/10 bg-black/20">
                        <img
                          src={trait.icon}
                          alt={trait.name}
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-black/90 text-white text-xs px-2 py-1 border border-white/10"
                    >
                      {trait.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* 数据统计 */}
          <div className="w-[90%] border-t border-white/10">
            <ChampionStats
              avgPlace={champion.avgPlace}
              top4Rate={champion.top4Rate}
              firstPlaceRate={champion.firstPlaceRate}
              matches={champion.matches}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

ChampionDetailPopover.displayName = 'ChampionDetailPopover'
