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

/**
 * 装备图标组件
 * 用于 ItemCard 中的主装备显示，包含排名、图标和分类信息
 */
export const ItemIcon = memo(({ item, className = '', onClick }: ItemIconProps) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* 装备图标 */}
      <div
        className="relative size-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/20 cursor-pointer transition-all hover:scale-105 hover:border-white/20"
        onClick={() => onClick?.(item)}
      >
        <img
          src={item.icon}
          alt={item.name}
          className="size-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 排名显示 */}
      <div className="flex items-center justify-center rounded bg-white/5 px-1.5 py-0.5">
        <span className="text-[10px] font-bold text-white/80">
          #
          {item.rank}
        </span>
      </div>
    </div>
  )
})

ItemIcon.displayName = 'ItemIcon'
