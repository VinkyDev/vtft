import type { ItemMeta } from 'types'
import { memo } from 'react'
import { ItemDetailPopover } from './ItemDetailPopover'

interface ItemCardProps {
  item: ItemMeta
}

/**
 * 紧凑式装备卡片组件
 * 只显示装备图标、名称和平均名次，点击显示详情
 */
export const ItemCard = memo(({ item }: ItemCardProps) => {
  return (
    <ItemDetailPopover item={item}>
      <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20 cursor-pointer">
        {/* 装备图标 */}
        <div className="flex justify-center mb-2">
          <div className="relative size-8 overflow-hidden rounded border border-white/10 bg-black/20">
            <img
              src={item.icon}
              alt={item.name}
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* 装备名称 */}
        <div className="text-center">
          <h3 className="text-xs font-medium text-white truncate">
            {item.name}
          </h3>
        </div>

        {/* 平均名次 */}
        {item.avgPlace && (
          <div className="text-center">
            <span className="text-[10px] text-gray-400">平均名次: </span>
            <span className="text-[10px] font-medium text-emerald-400">
              {item.avgPlace.toFixed(2)}
            </span>
          </div>
        )}

        {/* Hover 高光效果 */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </ItemDetailPopover>
  )
})

ItemCard.displayName = 'ItemCard'
