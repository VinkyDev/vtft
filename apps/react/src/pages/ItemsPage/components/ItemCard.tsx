import type { ItemMeta } from 'types'
import { memo } from 'react'
import { Badge } from 'ui'
import { ItemStats } from './ItemStats'

interface ItemCardProps {
  item: ItemMeta
}

const categoryMap: Record<string, { label: string, color: string }> = {
  radiant: { label: '光辉', color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' },
  artifact: { label: '神器', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
  core: { label: '核心', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
  emblem: { label: '转职', color: 'border-pink-500/30 bg-pink-500/10 text-pink-300' },
  component: { label: '基础', color: 'border-gray-500/30 bg-gray-500/10 text-gray-300' },
}

/**
 * 装备卡片组件
 */
export const ItemCard = memo(({ item }: ItemCardProps) => {
  const categoryInfo = categoryMap[item.category] || { label: '其他', color: 'border-gray-500/30 bg-gray-500/10 text-gray-300' }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2.5 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start gap-2.5">
        {/* 左侧: 装备图标和排名 */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/20">
            <img
              src={item.icon}
              alt={item.name}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-center rounded bg-white/5 px-1.5 py-0.5">
            <span className="text-[10px] font-bold text-white/80">
              #
              {item.rank}
            </span>
          </div>
        </div>

        {/* 中间: 装备信息 */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* 装备名称和分类 */}
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-white">
              {item.name}
            </h3>
            <Badge variant="outline" className={`h-4 px-1 text-[10px] ${categoryInfo.color}`}>
              {categoryInfo.label}
            </Badge>
          </div>

          {/* 合成配方 */}
          {item.components && item.components.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400">配方:</span>
              <div className="flex gap-1">
                {item.components.map((component: string, idx: number) => (
                  <span key={idx} className="text-[10px] text-gray-300">{component}</span>
                ))}
              </div>
            </div>
          )}

          {/* 推荐英雄 */}
          {item.recommendedFor && item.recommendedFor.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400">推荐:</span>
              <div className="flex flex-wrap gap-1">
                {item.recommendedFor.slice(0, 5).map((champion: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="h-4 border-emerald-500/30 bg-emerald-500/10 px-1 text-[10px] text-emerald-300"
                  >
                    {champion}
                  </Badge>
                ))}
                {item.recommendedFor.length > 5 && (
                  <span className="text-[10px] text-gray-400">
                    +
                    {item.recommendedFor.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 右侧: 数据指标 */}
        <ItemStats
          avgPlace={item.avgPlace}
          top4Rate={item.top4Rate}
          firstPlaceRate={item.firstPlaceRate}
          matches={item.matches}
        />
      </div>

      {/* Hover 高光效果 */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  )
})

ItemCard.displayName = 'ItemCard'
