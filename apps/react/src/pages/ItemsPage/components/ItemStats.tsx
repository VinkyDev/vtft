import { memo } from 'react'

interface ItemStatsProps {
  avgPlace?: number
  top4Rate?: number
  firstPlaceRate?: number
  matches?: number
}

/**
 * 装备数据指标组件
 */
export const ItemStats = memo(({ avgPlace, top4Rate, firstPlaceRate, matches }: ItemStatsProps) => {
  return (
    <div className="flex flex-col items-end gap-0.5 text-xs">
      {avgPlace !== undefined && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">平均</span>
          <span className="font-semibold text-blue-300">{avgPlace.toFixed(2)}</span>
        </div>
      )}
      {top4Rate !== undefined && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">前四</span>
          <span className="font-semibold text-green-300">
            {top4Rate.toFixed(1)}
            %
          </span>
        </div>
      )}
      {firstPlaceRate !== undefined && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">吃鸡</span>
          <span className="font-semibold text-amber-300">
            {firstPlaceRate.toFixed(1)}
            %
          </span>
        </div>
      )}
      {matches !== undefined && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">场次</span>
          <span className="font-medium text-gray-300">{matches}</span>
        </div>
      )}
    </div>
  )
})

ItemStats.displayName = 'ItemStats'
