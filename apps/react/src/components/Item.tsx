import type { ItemMeta } from 'types'
import { memo, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { useGameDataStore } from '@/store'

interface ItemProps {
  /** 装备名称 */
  itemName: string
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

/** 根据尺寸获取样式 */
function getSizeClasses(size: 'tiny' | 'small' | 'medium' | 'large' | 'xl') {
  switch (size) {
    case 'tiny':
      return 'h-2 w-2'
    case 'small':
      return 'h-3 w-3'
    case 'medium':
      return 'h-4 w-4'
    case 'large':
      return 'h-6 w-6'
    case 'xl':
      return 'size-12'
  }
}

/** 根据变体获取样式 */
function getVariantClasses(variant: 'default' | 'card' | 'recipe') {
  switch (variant) {
    case 'default':
      return 'rounded border border-gray-600 bg-black/60'
    case 'card':
      return 'rounded-md border border-white/10 bg-black/20'
    case 'recipe':
      return 'rounded border border-gray-500/50 bg-gray-800/30'
  }
}

export const Item = memo(({
  itemName,
  size = 'medium',
  variant = 'default',
  showTooltip = true,
  className = '',
  onClick,
}: ItemProps) => {
  // 从 store 获取装备数据
  const { items } = useGameDataStore()

  // 根据 name 查找装备数据
  const item = useMemo(() => {
    return items.find(it => it.name === itemName)
  }, [items, itemName])

  // 如果没有找到装备数据，返回占位符
  if (!item) {
    const sizeClasses = getSizeClasses(size)
    const variantClasses = getVariantClasses(variant)
    return (
      <div className={`${sizeClasses} ${variantClasses} ${className}`}>
        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700 rounded" />
      </div>
    )
  }

  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant)

  const itemElement = (
    <div
      className={`${sizeClasses} ${variantClasses} object-cover transition-all hover:scale-110 hover:shadow-lg cursor-pointer shrink-0 ${className}`}
      onClick={() => onClick?.(item)}
    >
      {item.icon
        ? (
            <img
              src={item.icon}
              alt={item.name}
              className="h-full w-full object-cover rounded"
              loading="lazy"
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700 rounded" />
          )}
    </div>
  )

  // 如果不显示工具提示，直接返回元素
  if (!showTooltip) {
    return itemElement
  }

  // 包装工具提示
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {itemElement}
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="bg-black/90 text-white border-white/10 text-xs"
      >
        <div className="space-y-1">
          <span className="font-semibold">{item.name}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
})

Item.displayName = 'Item'
