import { memo } from 'react'

interface ChampionStatsProps {
  avgPlace?: number
  top4Rate?: number
  firstPlaceRate?: number
  matches?: number
}

/** 格式化场次数字，减少显示空间 */
function formatMatches(matches: number): string {
  if (matches >= 100000) {
    return `${(matches / 10000).toFixed(0)}w`
  }
  if (matches >= 1000) {
    return `${(matches / 1000).toFixed(0)}k`
  }
  return matches.toString()
}

/**
 * 英雄数据指标组件
 */
export const ChampionStats = memo(({ avgPlace, top4Rate, firstPlaceRate, matches }: ChampionStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
      {avgPlace !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">平均</span>
          <span className="font-semibold text-emerald-300">{avgPlace.toFixed(1)}</span>
        </div>
      )}
      {top4Rate !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">前四</span>
          <span className="font-semibold text-blue-300">
            {top4Rate.toFixed(0)}
            %
          </span>
        </div>
      )}
      {firstPlaceRate !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">吃鸡</span>
          <span className="font-semibold text-yellow-300">
            {firstPlaceRate.toFixed(0)}
            %
          </span>
        </div>
      )}
      {matches !== undefined && (
        <div className="flex items-center justify-between">
          <span className="text-gray-400">场次</span>
          <span className="font-medium text-gray-300">{formatMatches(matches)}</span>
        </div>
      )}
    </div>
  )
})

ChampionStats.displayName = 'ChampionStats'
