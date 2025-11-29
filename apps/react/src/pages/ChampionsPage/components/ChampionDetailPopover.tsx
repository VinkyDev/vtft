import type { UnitStat } from 'types'
import { find } from 'lodash-es'
import { memo, useEffect, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { Champion, Item, Trait } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { ChampionStats } from './ChampionStats'

interface UnitDetailPopoverProps {
  /** 英雄数据 */
  unit: UnitStat
  /** 触发器元素 */
  children: React.ReactNode
}

/**
 * 英雄详情弹窗组件
 * 显示英雄的完整信息，包括费用、羁绊、统计数据等
 */
export const UnitDetailPopover = memo(({ unit, children }: UnitDetailPopoverProps) => {
  const { lookups, unitItemsIndex, loadUnitItems } = useGlobalStore()

  useEffect(() => {
    if (!unitItemsIndex || Object.keys(unitItemsIndex).length === 0)
      loadUnitItems()
  }, [unitItemsIndex, loadUnitItems])

  const unitItem = useMemo(() => unitItemsIndex.unitsById?.[unit.unit], [unit.unit, unitItemsIndex])

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

          <Champion
            className="size-8"
            id={unit.unit}
            wrapperClassName="flex-col gap-1 w-full"
            renderExtra={innerChampion => (
              <>
                <h3 className="font-medium text-[10px] text-white truncate">
                  {innerChampion.name}
                </h3>

                {innerChampion.traits && innerChampion.traits.length > 0 && (
                  // <div className="border-t border-white/10">
                  <div className="flex justify-center items-center gap-2">
                    {innerChampion.traits.map(trait => (
                      <Trait
                        key={trait}
                        id={find(lookups?.traits, { name: trait })?.apiName || ''}
                      />
                    ))}
                  </div>
                  // </div>
                )}

                <div className="w-[95%]">
                  <ChampionStats
                    avgPlace={unit.avg}
                    top4Rate={unit.top4Rate}
                    firstPlaceRate={unit.firstRate}
                    matches={unit.pickRate}
                  />
                </div>

                {unitItem?.items && unitItem.items.length > 0 && (
                  <div className="pt-1.5">
                    <div className="flex justify-center gap-0.5">
                      {unitItem.items.slice(0, 5).map(item => (
                        item.itemName && (
                          <Item
                            key={item.itemName}
                            id={item.itemName}
                            className="size-5"
                          />
                        )
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
})

UnitDetailPopover.displayName = 'UnitDetailPopover'
