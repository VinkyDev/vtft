import type { Option } from 'types'
import type { TransitionAnalysis, UnitAnalysis } from './helpers'
import { memo, useCallback, useMemo } from 'react'
import { ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, EmptyState } from '@/components'
import { useUnitsUtils } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { analyzeTransitions, parseOptions } from './helpers'

export interface TransitionTabProps {
  earlyOptions?: Record<string, Option[]>
  options?: Record<string, Option[]>
}

function extractCoreUnits(builds: Array<{ units: string[], count: number }>): string[] {
  const topBuilds = builds.slice(0, 10)
  if (topBuilds.length === 0)
    return []

  const unitCounts = new Map<string, number>()
  for (const build of topBuilds) {
    for (const unit of build.units) {
      unitCounts.set(unit, (unitCounts.get(unit) ?? 0) + 1)
    }
  }

  const threshold = Math.ceil(topBuilds.length * 0.8)
  return Array.from(unitCounts.entries())
    .filter(([, count]) => count >= threshold)
    .map(([unit]) => unit)
}

const CATEGORY_STYLES = {
  core: { color: '#fbbf24', label: '核心', opacity: 1 },
  recommended: { color: '#60a5fa', label: '推荐', opacity: 0.7 },
  optional: { color: '#6b7280', label: '备选', opacity: 0.45 },
}

const UnitWithRate = memo(({ item }: { item: UnitAnalysis }) => {
  const ratePercent = Math.round(item.rate * 100)
  const style = CATEGORY_STYLES[item.category]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative" style={{ opacity: style.opacity }}>
          <Champion id={item.unit} className="size-7 sm:size-8" showTooltip={false} />
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 rounded-full"
            style={{
              width: `${Math.max(ratePercent * 0.8, 20)}%`,
              backgroundColor: style.color,
            }}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <div className="font-medium" style={{ color: style.color }}>{style.label}</div>
        <div className="text-gray-400">
          {ratePercent}
          % ·
          {' '}
          {item.count}
          场
        </div>
      </TooltipContent>
    </Tooltip>
  )
})

UnitWithRate.displayName = 'UnitWithRate'

const UnitGroup = memo(({ units }: { units: UnitAnalysis[] }) => (
  <div className="flex flex-wrap gap-1">
    {units.map(item => <UnitWithRate key={item.unit} item={item} />)}
  </div>
))

UnitGroup.displayName = 'UnitGroup'

const TransitionLevelRow = memo(({ transition }: { transition: TransitionAnalysis }) => {
  const { level, core, recommended, optional } = transition
  const hasContent = core.length > 0 || recommended.length > 0 || optional.length > 0

  if (!hasContent)
    return null

  const groups = [core, recommended, optional].filter(g => g.length > 0)

  return (
    <div className="rounded-lg bg-white/5 border border-white/5 p-2 sm:p-2.5">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="shrink-0 size-7 sm:size-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-300">
          {level}
        </div>

        {/* 小屏：换行 */}
        <div className="flex flex-col gap-2.5 sm:hidden">
          {groups.map((g, i) => <UnitGroup key={i} units={g} />)}
        </div>

        {/* 大屏：分割线 */}
        <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-1">
          {groups.map((g, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <div className="w-px h-6 bg-white/10 mx-1" />}
              {g.map(item => <UnitWithRate key={item.unit} item={item} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

TransitionLevelRow.displayName = 'TransitionLevelRow'

export const TransitionTab = memo(({ earlyOptions, options }: TransitionTabProps) => {
  const { sortUnitsByCost } = useUnitsUtils()
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)

  const getUnitCost = useCallback((unitId: string): number => {
    return unitsById[unitId]?.cost ?? 5
  }, [unitsById])

  const earlyBuilds = useMemo(
    () => parseOptions(earlyOptions ?? {}, sortUnitsByCost),
    [earlyOptions, sortUnitsByCost],
  )

  const lateBuilds = useMemo(
    () => parseOptions(options ?? {}, sortUnitsByCost).filter(lb => lb.level !== '11'),
    [options, sortUnitsByCost],
  )

  const transitions = useMemo(() => {
    const levelMap = new Map<string, typeof earlyBuilds[0]>()
    for (const lb of earlyBuilds)
      levelMap.set(lb.level, lb)
    for (const lb of lateBuilds)
      levelMap.set(lb.level, lb)

    const allLevelBuilds = Array.from(levelMap.values()).sort((a, b) => Number(a.level) - Number(b.level))
    if (allLevelBuilds.length === 0)
      return []

    const lastLevel = allLevelBuilds[allLevelBuilds.length - 1]!
    const coreUnits = extractCoreUnits(lastLevel.builds)
    const transitionLevels = allLevelBuilds.slice(0, -1)

    return analyzeTransitions(transitionLevels, coreUnits, getUnitCost)
  }, [earlyBuilds, lateBuilds, getUnitCost])

  if (transitions.length === 0) {
    return <EmptyState message="暂无过渡阵容" />
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-55px)] sm:h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-2 p-2 px-3">
          {transitions.map(trans => (
            <TransitionLevelRow key={trans.level} transition={trans} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

TransitionTab.displayName = 'TransitionTab'
