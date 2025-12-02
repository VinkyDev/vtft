import type { CompItem, Unit } from 'types'
import { memo, useEffect, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, Impact, Item } from '@/components'
import { useAdaptiveList } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'

interface ItemCardProps {
  item: CompItem
  onChampionClick?: (championName: string) => void
}

/**
 * 装备卡片组件
 * 展示单个装备的详细信息（横向一行布局）
 */
export const ItemCard = memo(({ item, onChampionClick }: ItemCardProps) => {
  const itemsById = useGlobalStore(s => s.lookupsIndex.itemsById)
  const unitItemsIndex = useGlobalStore(s => s.unitItemsIndex)
  const loadUnitItems = useGlobalStore(s => s.loadUnitItems)

  useEffect(() => {
    if (!unitItemsIndex || Object.keys(unitItemsIndex.itemNamesById).length === 0)
      loadUnitItems()
  }, [unitItemsIndex, loadUnitItems])

  const itemMeta = useMemo(() => itemsById[item.itemNames], [itemsById, item.itemNames])
  const components = itemMeta?.composition ?? []

  const recommendedUnits = item?.units ?? []

  const { containerRef, visibleItems, remainingCount, showMore } = useAdaptiveList<Unit>({
    items: recommendedUnits,
    itemWidth: 16,
    moreButtonWidth: 16,
    minVisible: 1,
  })

  return (
    <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-md p-1.5 border border-white/10 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
      <div className="grid grid-cols-[30px_2fr_2fr_3fr] sm:grid-cols-[180px_2fr_4fr_3fr] gap-2 items-center pl-2">
        <Item
          id={item.itemNames}
          className="size-6"
          showTooltip={false}
          wrapperClassName="flex justify-start items-center gap-2"
          renderExtra={data => (
            <span className="hidden sm:block text-[10px] sm:text-xs text-gray-400">
              {data?.name}
            </span>
          )}
        />

        <div className="flex items-center gap-1 justify-center">
          {components[0] && (
            <Item id={components[0]} className="size-4 sm:size-5" showTooltip={false} />
          )}
          {components[0] && components[1] && (
            <span className="text-gray-500 text-xs">+</span>
          )}
          {components[1] && (
            <Item id={components[1]} className="size-4 sm:size-5" showTooltip={false} />
          )}
        </div>

        <div className="flex items-center gap-1 justify-self-center">
          {item.avg !== undefined && (
            <>
              <span className="text-gray-400 text-[10px] sm:text-xs">影响</span>
              <Impact avgRank={item.avg!} className="text-[10px] sm:text-xs" />
            </>
          )}
        </div>

        <div ref={containerRef} className="flex items-center gap-1 min-w-0 justify-end">
          {visibleItems.map((item, index) => (
            item.units && (
              <div
                key={`${item.units}-${index}`}
                onClick={() => onChampionClick?.(item.units!)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <Champion
                  id={item.units}
                  showTooltip={true}
                  className="size-4 sm:size-5"
                />
              </div>
            )

          ))}
          {showMore && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-4 h-4 rounded border border-white/20 bg-gray-700/50 flex items-center justify-center text-white text-[7px] font-bold cursor-pointer shrink-0">
                  +
                  {remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/90 text-white border-white/10"
              >
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {recommendedUnits.slice(visibleItems.length).map((item, index) => (
                    item.units && (
                      <div
                        key={`${item.units}-${visibleItems.length + index}`}
                        onClick={() => onChampionClick?.(item.units!)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Champion
                          id={item.units}
                          className="size-4"
                          showTooltip={false}
                        />
                      </div>
                    )
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
})

ItemCard.displayName = 'ItemCard'
