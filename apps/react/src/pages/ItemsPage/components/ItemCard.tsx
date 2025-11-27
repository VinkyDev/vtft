import type { ItemStat } from 'types'
import { memo } from 'react'
import { Impact, Item } from '@/components'
import { ItemDetailPopover } from './ItemDetailPopover'

interface ItemCardProps {
  item: ItemStat
}

/**
 * 紧凑式装备卡片组件
 * 只显示装备图标、名称和影响，点击显示详情
 */
export const ItemCard = memo(({ item }: ItemCardProps) => {
  return (
    <ItemDetailPopover item={item}>
      <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/2 p-2 transition-all hover:border-white/10 hover:from-white/12 hover:to-white/5 hover:shadow-lg hover:shadow-black/20 cursor-pointer">
        <div className="flex justify-center mb-2">
          <Item
            wrapperClassName="flex-col gap-2"
            className="size-8"
            id={item.itemName}
            showTooltip={false}
            renderExtra={innerItem => (
              <div className="flex flex-col items-center justify-center gap-1 w-full">
                <div className="text-center text-xs font-medium text-white truncate w-full">
                  {innerItem.name}
                </div>
                <div className="leading-2.5">
                  <span className="text-[10px] text-gray-400">影响: </span>
                  <Impact avgRank={item.avg} className="text-[10px]" />
                </div>
              </div>
            )}
          />
        </div>

        {/* Hover 高光效果 */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </ItemDetailPopover>
  )
})

ItemCard.displayName = 'ItemCard'
