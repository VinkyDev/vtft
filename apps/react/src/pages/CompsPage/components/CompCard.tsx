import type { EnhancedCompData } from '@/utils/compRating'
import { find } from 'lodash-es'
import { Copy } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Badge, Popover, PopoverContent, PopoverTrigger, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, Trait } from '@/components'
import { useAdaptiveList, useUnitsUtils } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { CompStats } from './CompStats'
import { TierBadge } from './TierBadge'

interface CompCardProps {
  comp: EnhancedCompData
  onClick?: (comp: EnhancedCompData) => void
}

export const CompCard = memo(({ comp, onClick }: CompCardProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)
  const { sortUnitsByCost, generateCompCode } = useUnitsUtils()

  // 羁绊列表自适应：最多一行，多余折叠为「+x」
  const {
    containerRef: traitsContainerRef,
    visibleItems: visibleTraits,
    remainingCount: remainingTraitsCount,
    showMore: showMoreTraits,
  } = useAdaptiveList<string>({
    items: comp.traits ?? [],
    itemWidth: 22,
    moreButtonWidth: 28,
    minVisible: 1,
  })

  const hiddenTraits = useMemo(
    () => (comp.traits ?? []).slice(visibleTraits.length),
    [comp.traits, visibleTraits.length],
  )

  const sortedUnits = useMemo(() => {
    if (!comp.units || comp.units.length === 0)
      return []
    return sortUnitsByCost(comp.units)
  }, [comp.units, sortUnitsByCost])

  const compCode = useMemo(() => {
    if (!comp.units || comp.units.length === 0)
      return ''
    return generateCompCode(comp.units)
  }, [comp.units, generateCompCode])

  const handleClick = () => {
    if (onClick) {
      onClick(comp)
    }
  }

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发卡片的 onClick
    if (compCode) {
      try {
        await navigator.clipboard.writeText(compCode)
      }
      catch (err) {
        // 如果复制失败，可以在这里处理错误
        console.error('Failed to copy code:', err)
      }
    }
  }

  return (
    <div
      className="group relative w-full overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/2 p-2.5 transition-all hover:border-white/10 hover:from-white/12 hover:to-white/5 hover:shadow-lg hover:shadow-black/20 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <TierBadge tier={comp.calculatedTier} />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-white">
              {Array.isArray(comp.name) && comp.name.length > 0
                ? comp.name
                    .map((n) => {
                      if (!n?.name)
                        return null
                      if (n.type === 'unit')
                        return unitsById[n.name]?.name || unitsById[n.name]?.en_name || n.name
                      if (n.type === 'trait')
                        return traitsById[n.name]?.name || traitsById[n.name]?.en_name || n.name
                      return n.name
                    })
                    .filter(Boolean)
                    .join(' ')
                : ''}
            </h3>
            {comp.category === 'low_pickrate' && (
              <Badge variant="outline" className="h-4 border-amber-500/30 bg-amber-500/10 px-1 text-[10px] text-amber-300">
                低出场
              </Badge>
            )}
            {compCode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="ml-auto shrink-0 p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="复制阵容代码"
                  >
                    <Copy className="size-3.5 text-gray-400 hover:text-gray-200" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={4}>
                  复制阵容代码
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {comp.traits && comp.traits.length > 0 && (
            <div
              ref={traitsContainerRef}
              className="flex flex-nowrap items-center gap-0.5"
            >
              {visibleTraits.map(trait => (
                <Trait key={trait} id={trait} />
              ))}

              {showMoreTraits && remainingTraitsCount > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="ml-0 inline-flex h-5 items-center rounded-full bg-white/5 px-1.5 text-[10px] text-gray-200 hover:bg-white/10"
                      onClick={e => e.stopPropagation()}
                    >
                      +
                      {remainingTraitsCount}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="top"
                    className="max-w-xs bg-black/95 text-white border-white/10 text-xs w-auto px-2 py-1"
                  >
                    <div className="flex flex-wrap gap-0.5">
                      {hiddenTraits.map(trait => (
                        <Trait key={trait} id={trait} showTooltip />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}

          {sortedUnits.length > 0 && (
            <div className="flex flex-wrap gap-x-1 gap-y-3 pb-1">
              {sortedUnits.slice(0, 9).map(unit => (
                <Champion
                  className="sm:size-10 size-7.5"
                  key={unit}
                  id={unit}
                  items={find(comp.builds, { unit })?.buildName || []}
                  showName
                />
              ))}
            </div>
          )}
        </div>

        <CompStats
          avgPlace={comp.avg}
          top4Rate={comp.top4Rate}
          firstPlaceRate={comp.firstRate}
          pickRate={comp.pickRate}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  )
})

CompCard.displayName = 'CompCard'
