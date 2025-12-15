import type { EnhancedCompData } from '@/utils/compRating'
import { find } from 'lodash-es'
import { ArrowUpRight, Copy, RefreshCw, Star } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Badge, Popover, PopoverContent, PopoverTrigger } from 'ui'
import { cn } from 'utils'
import { Champion, Trait } from '@/components'
import { useAdaptiveList, useUnitsUtils } from '@/hooks'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useGlobalStore } from '@/store/globalStore'
import { CompStats } from './CompStats'
import { TierBadge } from './TierBadge'

interface CompCardProps {
  comp: EnhancedCompData
  onClick?: (comp: EnhancedCompData) => void
}

const LEVELLING_CONFIG: Record<
  string,
  { type: 'fast' | 'reroll', level: number }
> = {
  'Fast 8': { type: 'fast', level: 8 },
  'Fast 9': { type: 'fast', level: 9 },
  'lvl 5': { type: 'reroll', level: 5 },
  'lvl 6': { type: 'reroll', level: 6 },
  'lvl 7': { type: 'reroll', level: 7 },
}

export const CompCard = memo(({ comp, onClick }: CompCardProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)
  const { sortUnitsByCost, generateCompCode } = useUnitsUtils()
  const toggleFavorite = useFavoritesStore(s => s.toggle)
  const isFavorite = useFavoritesStore(s => comp.compId ? s.favorites.has(comp.compId) : false)

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
    e.stopPropagation()
    if (compCode) {
      await navigator.clipboard.writeText(compCode).catch(() => {})
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (comp.compId)
      toggleFavorite(comp.compId)
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
            {(() => {
              if (!comp.levelling)
                return null
              const cfg = LEVELLING_CONFIG[comp.levelling]
              if (!cfg)
                return null
              return (
                <Badge
                  variant="outline"
                  className={cn(
                    'inline-flex h-4 items-center gap-0.5 px-1.5 text-[10px]',
                    cfg.type === 'fast'
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                      : 'border-indigo-400/40 bg-indigo-500/15 text-indigo-100',
                  )}
                >
                  {cfg.type === 'fast'
                    ? <ArrowUpRight className="size-2.5! shrink-0" />
                    : <RefreshCw className="size-2.5! shrink-0 mr-0.5" />}
                  <span className="leading-none tracking-wider">
                    {cfg.level}
                    级
                  </span>
                </Badge>
              )
            })()}
            {comp.category === 'low_pickrate' && (
              <Badge variant="outline" className="h-4 border-amber-500/30 bg-amber-500/10 px-1 text-[10px] text-amber-300">
                低出场
              </Badge>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-0.5">
              {compCode && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy className="size-3.5 text-gray-400 hover:text-gray-200" />
                </button>
              )}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={cn(
                  'p-1 rounded transition-colors',
                  isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hover:bg-white/10',
                )}
              >
                <Star
                  className={cn(
                    'size-3.5 transition-colors',
                    isFavorite ? 'fill-amber-400 text-amber-400' : 'text-gray-400 hover:text-gray-200',
                  )}
                />
              </button>
            </div>
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
              {sortedUnits.slice(0, 9).map((unit, index) => {
                const isThreeStar = (comp.stars ?? []).includes(unit)
                const isFourStar = (comp.stars_4 ?? []).includes(unit)

                return (
                  <Champion
                    className="sm:size-10 size-7.5"
                    key={`${unit}-${index}`}
                    id={unit}
                    items={find(comp.builds, { unit })?.buildName || []}
                    showName
                    starTier={isFourStar ? 4 : isThreeStar ? 3 : undefined}
                  />
                )
              })}
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
