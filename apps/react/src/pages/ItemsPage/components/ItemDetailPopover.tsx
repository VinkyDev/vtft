import type { ItemMeta } from 'types'
import { Plus } from 'lucide-react'
import { memo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { Champion, Item } from '../../../components'
import { ItemStats } from './ItemStats'

interface ItemDetailPopoverProps {
  /** 装备数据 */
  item: ItemMeta
  /** 触发器元素 */
  children: React.ReactNode
}

/**
 * 装备详情弹窗组件
 * 显示装备的完整信息，包括配方、推荐英雄、统计数据等
 */
export const ItemDetailPopover = memo(({ item, children }: ItemDetailPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-32 p-2 bg-black/95 border-white/10 text-white"
        side="right"
        align="start"
      >
        <div className="flex flex-col items-center space-y-1.5">
          {/* 装备头部信息 */}
          <div className="text-center">
            <div className="relative size-10 mx-auto mb-1 overflow-hidden rounded border border-white/10 bg-black/20">
              <img
                src={item.icon}
                alt={item.name}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="font-medium text-[10px] text-white truncate mb-0.5">
              {item.name}
            </h3>
            {item.components && item.components.length > 0 && (
              <div className="border-t border-white/10 pt-1.5">
                <div className="flex items-center justify-center">
                  {item.components.map((component: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <Item
                        itemName={component}
                        size="medium"
                        variant="default"
                        showTooltip={true}
                      />
                      {idx < item.components!.length - 1 && (
                        <Plus className="h-3 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 数据统计 */}
          <div className="w-[90%] border-t border-white/10 pt-1.5">
            <ItemStats
              avgPlace={item.avgPlace}
              top4Rate={item.top4Rate}
              firstPlaceRate={item.firstPlaceRate}
              matches={item.matches}
            />
          </div>

          {item.recommendedFor && item.recommendedFor.length > 0 && (
            <div className="border-t border-white/10 pt-1.5">
              <div className="flex flex-wrap justify-center gap-0.5">
                {item.recommendedFor.slice(0, 6).map((champion: string, idx: number) => (
                  <Champion
                    className="!w-5 !h-5"
                    key={idx}
                    championName={champion}
                    size="tiny"
                    showPriority={false}
                    showTooltip={true}
                  />
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
