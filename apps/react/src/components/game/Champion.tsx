import type { ChampionMeta, Item as ItemType } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useGameDataStore } from '@/store/dataStore'
import { getChampionCostColor, getChampionSizeClasses } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'
import { Item } from './Item'

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
  /** 装备列表（可选，用于显示英雄携带的装备） */
  items?: ItemType[]
  /** 装备尺寸 */
  itemSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xl'
  /** 装备显示位置 */
  itemsPosition?: 'bottom' | 'right'
  /** 是否显示英雄名称（开启后无 hover 效果） */
  showName?: boolean
}

export const Champion = memo(({
  championName,
  size = 'medium',
  showPriority = true,
  priority,
  showTooltip = true,
  className = '',
  onClick,
  items,
  itemSize = 'small',
  itemsPosition = 'bottom',
  showName = false,
}: ChampionProps) => {
  const { champions } = useGameDataStore()
  const { tooltipConfig } = useConfigStore()

  const champion = useMemo(() => {
    return find(champions, champ => champ.name === championName)
  }, [champions, championName])

  if (!champion) {
    return null
  }

  const costColors = getChampionCostColor(champion.cost || 1)
  const sizeClasses = getChampionSizeClasses(size)

  // 检查是否应该显示工具提示
  const shouldShowTooltip = showTooltip && tooltipConfig.championTooltip && !showName

  const championElement = (
    <div
      className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 ${costColors.border} bg-black/40 transition-all ${showName ? '' : 'hover:shadow-lg cursor-pointer'} ${className}`}
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
            <div className="h-full w-full bg-linear-to-br from-gray-600 to-gray-700" />
          )}

      {showPriority && priority && (
        <div className={`absolute left-0 top-0 ${costColors.bg} ${sizeClasses.priority} font-bold leading-none text-white`}>
          {priority}
        </div>
      )}

      {/* 英雄名称 - 中间偏下 */}
      {showName && (
        <div className="absolute bottom-px left-1/2 -translate-x-1/2 z-10">
          <div
            className="text-white text-[7px] font-bold px-1 whitespace-nowrap"
            style={{
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {champion.name}
          </div>
        </div>
      )}
    </div>
  )

  const championWithTooltip = (
    <WithTooltip
      show={shouldShowTooltip}
      content={(
        <div className="space-y-1">
          <span className="font-semibold">{champion.name}</span>
        </div>
      )}
    >
      {championElement}
    </WithTooltip>
  )

  // 如果没有装备，直接返回英雄组件
  if (!items || items.length === 0) {
    return championWithTooltip
  }

  // 根据位置参数决定布局方向
  const containerClass = itemsPosition === 'right' ? 'flex-row gap-1' : 'flex-col gap-0.5'
  const itemsClass = itemsPosition === 'right' ? 'flex-col gap-0.5' : 'flex-row gap-0.5'

  return (
    <div className={`flex items-center ${containerClass}`}>
      {championWithTooltip}

      {items.length > 0 && (
        <div className={`flex ${itemsClass}`}>
          {items.slice(0, 3).map(item => (
            <Item
              key={item.name}
              itemName={item.name}
              size={itemSize}
              showTooltip={showTooltip}
            />
          ))}
        </div>
      )}
    </div>
  )
})

Champion.displayName = 'Champion'
