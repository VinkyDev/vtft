import type { ChampionMeta } from 'types'
import { memo } from 'react'
import { Champion, Impact } from '@/components'
import { ChampionDetailPopover } from './ChampionDetailPopover'

interface ChampionCardProps {
  champion: ChampionMeta
}

/**
 * 紧凑式英雄卡片组件
 * 只显示英雄图标、名称和影响，点击显示详情
 */
export const ChampionCard = memo(({ champion }: ChampionCardProps) => {
  return (
    <ChampionDetailPopover champion={champion}>
      <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20 cursor-pointer">
        {/* 英雄图标 */}
        <div className="flex justify-center mb-2">
          <div className="relative overflow-hidden rounded border border-white/10 bg-black/20">
            <Champion className="!size-8" championName={champion.name} showTooltip={false} />
          </div>
        </div>

        {/* 英雄名称 */}
        <div className="text-center">
          <h3 className="text-xs font-medium text-white truncate">
            {champion.name}
          </h3>
        </div>

        {/* 影响 */}
        {champion.avgPlace !== undefined && (
          <div className="text-center">
            <span className="text-[10px] text-gray-400">影响: </span>
            <Impact avgRank={champion.avgPlace} className="text-[10px]" />
          </div>
        )}

        {/* Hover 高光效果 */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </ChampionDetailPopover>
  )
})

ChampionCard.displayName = 'ChampionCard'
