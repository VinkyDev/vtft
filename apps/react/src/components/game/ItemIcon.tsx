import type { ItemMeta } from 'types'
import { memo } from 'react'

interface ItemIconProps {
  /** 装备数据 */
  item: ItemMeta
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (item: ItemMeta) => void
}

export const ItemIcon = memo(({ item, className = '', onClick }: ItemIconProps) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className="relative size-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/20 cursor-pointer transition-all hover:border-white/20"
        onClick={() => onClick?.(item)}
      >
        <img
          src={item.icon}
          alt={item.name}
          className="size-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>
    </div>
  )
})

ItemIcon.displayName = 'ItemIcon'
