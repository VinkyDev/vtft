import type { EnhancedCompData } from '@/utils/compRating'
import { find } from 'lodash-es'
import { memo } from 'react'
import { Badge } from 'ui'
import { Champion, Trait } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { CompStats } from './CompStats'
import { TierBadge } from './TierBadge'

interface CompCardProps {
  comp: EnhancedCompData
  onClick?: (comp: EnhancedCompData) => void
}

export const CompCard = memo(({ comp, onClick }: CompCardProps) => {
  const { lookupsIndex } = useGlobalStore()
  const handleClick = () => {
    if (onClick) {
      onClick(comp)
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/2 p-2.5 transition-all hover:border-white/10 hover:from-white/12 hover:to-white/5 hover:shadow-lg hover:shadow-black/20 cursor-pointer"
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
                        return lookupsIndex.unitsById[n.name]?.name || lookupsIndex.unitsById[n.name]?.en_name || n.name
                      if (n.type === 'trait')
                        return lookupsIndex.traitsById[n.name]?.name || lookupsIndex.traitsById[n.name]?.en_name || n.name
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
          </div>

          {comp.traits && comp.traits.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {comp.traits.map(trait => (
                <Trait key={trait} id={trait} />
              ))}
            </div>
          )}

          {comp.units && comp.units.length > 0 && (
            <div className="flex flex-wrap gap-x-1 gap-y-2.5">
              {comp.units.slice(0, 9).map(unit => (
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
