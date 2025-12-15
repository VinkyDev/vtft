import type { FinalLevel } from 'types'
import { orderBy, take } from 'lodash-es'
import { memo, useMemo } from 'react'

interface LevelIndicatorProps {
  levels: FinalLevel[]
}

export const LevelIndicator = memo(({ levels }: LevelIndicatorProps) => {
  const topLevels = useMemo(() => {
    const totalCount = levels.reduce((sum, l) => sum + (l.count ?? 0), 0)
    const sorted = orderBy(levels, ['count'], ['desc'])
    return take(sorted, 3).map(item => ({
      ...item,
      percent: totalCount > 0 ? ((item.count ?? 0) / totalCount * 100).toFixed(0) : '0',
    }))
  }, [levels])

  if (topLevels.length === 0)
    return null

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="hidden sm:inline text-zinc-500">常见等级</span>
      <div className="flex items-center gap-1.5">
        {topLevels.map((item, idx) => (
          <div
            key={item.level}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
              idx === 0
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-zinc-700/50 text-zinc-300'
            }`}
          >
            <span className="font-medium">
              Lv
              {item.level}
            </span>
            <span className="text-[10px] opacity-70">
              {item.percent}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})

LevelIndicator.displayName = 'LevelIndicator'
