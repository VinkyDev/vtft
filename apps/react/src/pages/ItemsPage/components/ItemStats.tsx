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
    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
      {avgPlace !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">排名</span>
          <span className="font-semibold text-blue-300">{avgPlace.toFixed(1)}</span>
        </div>
      )}
      {top4Rate !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">前四</span>
          <span className="font-semibold text-green-300">
            {top4Rate.toFixed(0)}
            %
          </span>
        </div>
      )}
      {firstPlaceRate !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">吃鸡</span>
          <span className="font-semibold text-amber-300">
            {firstPlaceRate.toFixed(0)}
            %
          </span>
        </div>
      )}
      {matches !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">登场</span>
          <span className="font-medium text-gray-300">
            {matches.toFixed(0)}
            %
          </span>
        </div>
      )}
    </div>
  )
})

ItemStats.displayName = 'ItemStats'
