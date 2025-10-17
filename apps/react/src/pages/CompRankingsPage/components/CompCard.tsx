import type { EnhancedCompData } from '../../../utils/compRating'
import { memo } from 'react'
import { Badge } from 'ui'
import { ChampionIcon } from './ChampionIcon'
import { CompStats } from './CompStats'
import { TierBadge } from './TierBadge'
import { TraitIcon } from './TraitIcon'

interface CompCardProps {
  comp: EnhancedCompData
}

export const CompCard = memo(({ comp }: CompCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2.5 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start gap-2.5">
        {/* 左侧: 评级徽章 */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <TierBadge tier={comp.calculatedTier} />
        </div>

        {/* 中间: 阵容信息 */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* 阵容名称和标签 */}
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-white">
              {comp.name}
            </h3>
            {comp.level && (
              <Badge variant="outline" className="h-4 border-purple-500/30 bg-purple-500/10 px-1 text-[10px] text-purple-300">
                {comp.level}
              </Badge>
            )}
            {comp.category === 'low_pickrate' && (
              <Badge variant="outline" className="h-4 border-amber-500/30 bg-amber-500/10 px-1 text-[10px] text-amber-300">
                低出场
              </Badge>
            )}
          </div>

          {/* 羁绊图标 */}
          {comp.traits && comp.traits.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {comp.traits.map((trait, idx) => (
                <TraitIcon key={idx} trait={trait} />
              ))}
            </div>
          )}

          {/* 英雄图标 */}
          {comp.champions && comp.champions.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {comp.champions.slice(0, 9).map((champion, idx) => (
                <ChampionIcon key={idx} champion={champion} />
              ))}
            </div>
          )}
        </div>

        {/* 右侧: 数据指标 */}
        <CompStats
          avgPlace={comp.avgPlace}
          top4Rate={comp.top4Rate}
          firstPlaceRate={comp.firstPlaceRate}
          pickRate={comp.pickRate}
        />
      </div>

      {/* Hover 高光效果 */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  )
})

CompCard.displayName = 'CompCard'
