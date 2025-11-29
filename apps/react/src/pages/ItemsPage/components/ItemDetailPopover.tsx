import type { ItemStat } from 'types'
import { Plus } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { Champion, Item } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { ItemStats } from './ItemStats'

interface ItemDetailPopoverProps {
  /** 装备数据 */
  item: ItemStat
  /** 触发器元素 */
  children: React.ReactNode
}

/**
 * 装备详情弹窗组件
 * 显示装备的完整信息，包括配方、推荐英雄、统计数据等
 */
export const ItemDetailPopover = memo(({ item, children }: ItemDetailPopoverProps) => {
  const unitItemsIndex = useGlobalStore(s => s.unitItemsIndex)

  const unitItem = useMemo(() => item.itemName ? unitItemsIndex?.itemNamesById?.[item.itemName] : undefined, [item.itemName, unitItemsIndex])

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-30 p-2 bg-black/95 border-white/10 text-white"
        side="right"
        align="start"
      >
        <div className="flex flex-col items-center space-y-1.5">
          {/* 装备头部信息 */}
          <div className="text-center">
            <Item
              id={item.itemName}
              className="size-8"
              wrapperClassName="flex-col gap-1"
              showTooltip={false}
              renderExtra={item => (
                <div className="flex flex-col">
                  <h3 className="font-medium text-[10px] text-white truncate mb-0.5">
                    {item.name}
                  </h3>
                  {item.composition && item.composition.length > 0 && (
                    <div className="border-t border-white/10 pt-1.5">
                      <div className="flex items-center justify-center">
                        {item.composition.map((component: string, idx: number) => (
                          <div key={component} className="flex items-center">
                            <Item
                              id={component}
                              className="size-5"
                              showTooltip={false}
                            />
                            {idx < item.composition!.length - 1 && (
                              <Plus className="h-3 w-5 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            />

          </div>

          {/* 数据统计 */}
          <div className="w-[95%] pt-1.5">
            <ItemStats
              avgPlace={item.avg}
              top4Rate={item.top4Rate}
              firstPlaceRate={item.firstRate}
              matches={item.pickRate}
            />
          </div>

          {unitItem?.units && unitItem.units.length > 0 && (
            <div className="pt-1.5">
              <div className="flex justify-center gap-0.5">
                {unitItem.units.slice(0, 5).map(unit => (
                  unit.unit && (
                    <Champion
                      className="size-5"
                      key={unit.unit}
                      id={unit.unit}
                    />
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
})

ItemDetailPopover.displayName = 'ItemDetailPopover'
