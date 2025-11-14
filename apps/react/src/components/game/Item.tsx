import type { ItemMeta } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useGameDataStore } from '@/store/dataStore'
import { getItemSizeClasses, getItemVariantClasses } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'

interface ItemProps {
  /** 装备名称（使用 itemName 时会从 store 查找装备数据） */
  itemName?: string
  /** 直接传入装备数据（优先级高于 itemName，用于简化场景） */
  item?: ItemMeta
  /** 尺寸大小 */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xl'
  /** 样式变体 */
  variant?: 'default' | 'card' | 'recipe'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (item: ItemMeta) => void
}

export const Item = memo(({
  itemName,
  size = 'medium',
  variant = 'default',
  showTooltip = true,
  className = '',
  onClick,
}: ItemProps) => {
  const { items } = useGameDataStore()
  const { tooltipConfig } = useConfigStore()

  // 优先使用直接传入的 item，否则从 store 查找
  const item = useMemo(() => {
    if (itemName) {
      return find(items, it => it.name === itemName)
    }
    return undefined
  }, [items, itemName])

  if (!item) {
    const sizeClasses = getItemSizeClasses(size)
    const variantClasses = getItemVariantClasses(variant)
    return (
      <div className={`${sizeClasses} ${variantClasses} ${className}`}>
        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700 rounded" />
      </div>
    )
  }

  const sizeClasses = getItemSizeClasses(size)
  const variantClasses = getItemVariantClasses(variant)

  // 检查是否应该显示工具提示
  const shouldShowTooltip = showTooltip && tooltipConfig.itemTooltip

  const itemElement = (
    <div
      className={`${sizeClasses} ${variantClasses} object-cover transition-all hover:shadow-lg cursor-pointer shrink-0 ${className}`}
      onClick={() => onClick?.(item)}
    >
      {item.icon
        ? (
            <img
              src={item.icon}
              alt={item.name}
              className="h-full w-full object-cover rounded"
              loading="lazy"
              draggable={false}
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700 rounded" />
          )}
    </div>
  )

  return (
    <WithTooltip
      show={shouldShowTooltip}
      side="bottom"
      content={(
        <div className="space-y-1 text-xs">
          <span className="font-semibold">{item.name}</span>
        </div>
      )}
    >
      {itemElement}
    </WithTooltip>
  )
})

Item.displayName = 'Item'
