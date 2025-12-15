import type { Option } from 'types'
import type { ParsedBuild } from './helpers'
import { SparklesIcon, TrendingUpIcon, UsersIcon } from 'lucide-react'
import { memo, useMemo, useState } from 'react'
import { ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { cn } from 'utils'
import { Champion, EmptyState, Trait } from '@/components'
import { useUnitsUtils } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { analyzeFinalComp, calculateTraits, formatAvg, parseOptions } from './helpers'

function parseTraitApiName(traitId: string): string {
  const parts = traitId.split('_')
  const last = parts[parts.length - 1]
  return /^\d+$/.test(last ?? '') ? parts.slice(0, -1).join('_') : traitId
}

const TopBuildRow = memo(({
  build,
  traits,
  commonTraitIds,
  rank,
  coreUnits,
}: {
  build: ParsedBuild
  traits: Array<{ traitId: string, level: number, count: number }>
  commonTraitIds: Set<string>
  rank: number
  coreUnits: string[]
}) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)

  const { commonTraits, uniqueTraits } = useMemo(() => {
    const common: typeof traits = []
    const unique: typeof traits = []
    for (const t of traits) {
      if (commonTraitIds.has(t.traitId))
        common.push(t)
      else
        unique.push(t)
    }
    return { commonTraits: common, uniqueTraits: unique }
  }, [traits, commonTraitIds])

  const hoveredTraitName = hoveredTrait ? traitsById[hoveredTrait]?.name : null

  return (
    <div className="rounded-lg bg-white/5 border border-white/5 p-2.5 hover:bg-white/8 transition-colors">
      <div className="flex items-center gap-2">
        <div className={cn(
          'shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold',
          rank === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-400',
        )}
        >
          {rank}
        </div>
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {build.units.map((unit) => {
            const unitMeta = unitsById[unit]
            const hasTrait = hoveredTraitName ? unitMeta?.traits?.includes(hoveredTraitName) : false
            const isHighlighted = !!hoveredTrait && hasTrait
            const isDimmed = !!hoveredTrait && !hasTrait

            return (
              <Champion
                key={unit}
                id={unit}
                className={cn(
                  'size-6 sm:size-7 transition-all',
                  !coreUnits.includes(unit) && 'ring-1 ring-blue-400/30 rounded',
                  isHighlighted && 'scale-110 z-10',
                  isDimmed && 'opacity-30',
                )}
                showTooltip
              />
            )
          })}
        </div>
        <div className="shrink-0 flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <TrendingUpIcon className="size-3" />
            {formatAvg(build.avg)}
          </span>
          <span className="flex items-center gap-0.5 text-gray-500">
            <UsersIcon className="size-3" />
            {build.count}
          </span>
        </div>
      </div>

      {traits.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-white/5">
          {commonTraits.map(t => (
            <div
              key={t.traitId}
              onMouseEnter={() => setHoveredTrait(parseTraitApiName(t.traitId))}
              onMouseLeave={() => setHoveredTrait(null)}
            >
              <Trait id={t.traitId} variant="icon-only" showTooltip />
            </div>
          ))}
          {commonTraits.length > 0 && uniqueTraits.length > 0 && (
            <div className="w-px h-4 bg-white/10 mx-1" />
          )}
          {uniqueTraits.map(t => (
            <div
              key={t.traitId}
              onMouseEnter={() => setHoveredTrait(parseTraitApiName(t.traitId))}
              onMouseLeave={() => setHoveredTrait(null)}
            >
              <Trait id={t.traitId} variant="with-label" showTooltip />
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

TopBuildRow.displayName = 'TopBuildRow'

export interface FinalCompTabProps {
  options?: Record<string, Option[]>
}

export const FinalCompTab = memo(({ options }: FinalCompTabProps) => {
  const { sortUnitsByCost } = useUnitsUtils()
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)

  const lateBuilds = useMemo(
    () => parseOptions(options ?? {}, sortUnitsByCost).filter(lb => lb.level !== '11'),
    [options, sortUnitsByCost],
  )

  const { analysis, level } = useMemo(() => {
    if (lateBuilds.length === 0)
      return { analysis: null, level: '' }

    const lastLevel = lateBuilds[lateBuilds.length - 1]!
    return {
      analysis: analyzeFinalComp(lastLevel.builds),
      level: lastLevel.level,
    }
  }, [lateBuilds])

  const { buildsWithTraits, commonTraitIds } = useMemo(() => {
    if (!analysis)
      return { buildsWithTraits: [], commonTraitIds: new Set<string>() }

    const allTraitSets = analysis.topBuilds.map(build => ({
      build,
      traits: calculateTraits(build.units, unitsById, traitsById),
    }))

    if (allTraitSets.length === 0)
      return { buildsWithTraits: allTraitSets, commonTraitIds: new Set<string>() }

    const firstTraitIds = new Set(allTraitSets[0]!.traits.map(t => t.traitId))
    const common = new Set<string>()

    for (const traitId of firstTraitIds) {
      if (allTraitSets.every(bt => bt.traits.some(t => t.traitId === traitId))) {
        common.add(traitId)
      }
    }

    return { buildsWithTraits: allTraitSets, commonTraitIds: common }
  }, [analysis, unitsById, traitsById])

  if (!analysis) {
    return <EmptyState message="暂无变阵数据" />
  }

  const { coreUnits, flexSlots } = analysis

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-55px)] sm:h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-3 p-2 px-3">
          <div className="flex items-center gap-2 px-1">
            <SparklesIcon className="size-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">
              Lv.
              {level}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/20 to-transparent" />
          </div>

          <div className="rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-3">
            {coreUnits.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
                  <div className="size-1.5 rounded-full bg-amber-400" />
                  核心
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {coreUnits.map(unit => (
                    <Champion
                      key={unit}
                      id={unit}
                      className="size-8 sm:size-9 ring-1 ring-amber-400/40 rounded"
                      showTooltip
                    />
                  ))}
                </div>
              </div>
            )}

            {flexSlots.length > 0 && flexSlots[0]!.options.length > 0 && (
              <div>
                <div className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
                  <div className="size-1.5 rounded-full bg-blue-400" />
                  灵活位
                </div>
                <div className="flex flex-wrap gap-1">
                  {flexSlots[0]!.options.slice(0, 8).map((opt, idx) => {
                    const maxCount = flexSlots[0]!.options[0]!.count
                    const opacity = 0.4 + (opt.count / maxCount) * 0.6

                    return (
                      <Tooltip key={opt.unit}>
                        <TooltipTrigger asChild>
                          <div style={{ opacity }}>
                            <Champion
                              id={opt.unit}
                              className={cn(
                                'size-7 sm:size-8 rounded transition-all hover:opacity-100',
                                idx === 0 && 'ring-1 ring-blue-400/50',
                              )}
                              showTooltip={false}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div>
                            排名
                            {' '}
                            {formatAvg(opt.avgRank)}
                          </div>
                          <div className="text-gray-400">
                            {opt.count}
                            {' '}
                            场
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {buildsWithTraits.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-gray-500 px-1">热门配置</div>
              {buildsWithTraits.map((bt, idx) => (
                <TopBuildRow
                  key={idx}
                  build={bt.build}
                  traits={bt.traits}
                  commonTraitIds={commonTraitIds}
                  rank={idx + 1}
                  coreUnits={coreUnits}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})

FinalCompTab.displayName = 'FinalCompTab'
