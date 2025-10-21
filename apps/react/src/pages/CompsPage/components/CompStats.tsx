import { isNil } from 'lodash-es'
import { memo } from 'react'

interface CompStatsProps {
  avgPlace?: number
  top4Rate?: number
  firstPlaceRate?: number
  pickRate?: number
}

// 格式化百分比
function formatPercent(value?: number) {
  if (isNil(value))
    return '-'
  return `${value.toFixed(1)}%`
}

// 格式化选取率（保留两位小数）
function formatPickRate(value?: number) {
  if (isNil(value))
    return '-'
  return `${value.toFixed(2)}%`
}

// 格式化数字
function formatNumber(value?: number) {
  if (isNil(value))
    return '-'
  return value.toFixed(2)
}

export const CompStats = memo(({ avgPlace, top4Rate, firstPlaceRate, pickRate }: CompStatsProps) => {
  return (
    <div className="flex shrink-0 flex-col gap-1 text-right self-center">
      {/* 平均排名 */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-500">排名</span>
        <span className="text-xs font-bold text-white">
          {formatNumber(avgPlace)}
        </span>
      </div>

      {/* 前四率 */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-500">前四</span>
        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-xs font-bold text-transparent">
          {formatPercent(top4Rate)}
        </span>
      </div>

      {/* 吃鸡率 */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-500">吃鸡</span>
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-xs font-bold text-transparent">
          {formatPercent(firstPlaceRate)}
        </span>
      </div>

      {/* 选率 */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-500">选率</span>
        <span className="text-xs text-gray-400">
          {formatPickRate(pickRate)}
        </span>
      </div>
    </div>
  )
})

CompStats.displayName = 'CompStats'
