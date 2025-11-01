import type { ChampionMeta } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo } from 'react'
import { useGameDataStore } from '@/store'
import { getChampionCostColor, getChampionSizeClasses } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'

interface ChampionProps {
  /** 英雄名称 */
  championName: string
  /** 尺寸大小 */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** 是否显示优先级标识 */
  showPriority?: boolean
  /** 自定义优先级文本（如果不提供，使用 rank） */
  priority?: string
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (champion: ChampionMeta) => void
}

export const Champion = memo(({
  championName,
  size = 'medium',
  showPriority = true,
  priority,
  showTooltip = true,
  className = '',
  onClick,
}: ChampionProps) => {
  const { champions } = useGameDataStore()

  const champion = useMemo(() => {
    return find(champions, champ => champ.name === championName)
  }, [champions, championName])

  if (!champion) {
    return null
  }

  const costColors = getChampionCostColor(champion.cost || 1)
  const sizeClasses = getChampionSizeClasses(size)

  const championElement = (
    <div
      className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 ${costColors.border} bg-black/40 transition-all hover:shadow-lg cursor-pointer ${className}`}
      onClick={() => onClick?.(champion)}
    >
      {champion.icon
        ? (
            <img
              src={champion.icon}
              alt={champion.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
          )}

      {showPriority && priority && (
        <div className={`absolute left-0 top-0 ${costColors.bg} ${sizeClasses.priority} font-bold leading-none text-white`}>
          {priority}
        </div>
      )}
    </div>
  )

  return (
    <WithTooltip
      show={showTooltip}
      content={(
        <div className="space-y-1">
          <span className="font-semibold">{champion.name}</span>
        </div>
      )}
    >
      {championElement}
    </WithTooltip>
  )
})

Champion.displayName = 'Champion'
