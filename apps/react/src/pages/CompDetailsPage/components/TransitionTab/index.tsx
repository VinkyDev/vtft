import type { Option } from 'types'
import type { TransitionAnalysis } from './helpers'
import { memo, useMemo } from 'react'
import { ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, EmptyState } from '@/components'
import { useUnitsUtils } from '@/hooks'
import { analyzeTransitions, formatAvg, parseOptions } from './helpers'

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

const TransitionLevelRow = memo(({
  transition,
  coreUnits: _coreUnits,
}: {
  transition: TransitionAnalysis
  coreUnits: string[]
}) => {
  const { level, unitPool, topBuilds } = transition

  return (
    <div className="rounded-lg bg-white/5 border border-white/5 p-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-300">
          {level}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5">
            {unitPool.slice(0, 12).map((item) => {
              const isFlex = !item.isCore && !item.isTransition
              const opacity = item.isCore ? 1 : item.isTransition ? 0.55 : 0.35

              return (
                <Tooltip key={item.unit}>
                  <TooltipTrigger asChild>
                    <div className="relative" style={{ opacity }}>
                      <Champion id={item.unit} className="size-6 sm:size-7" showTooltip={false} />
                      {isFlex && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-blue-400" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div>{item.isCore ? '核心' : item.isTransition ? '过渡' : '灵活'}</div>
                    <div className="text-gray-400">
                      {item.count}
                      {' '}
                      场
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {topBuilds.length > 1 && (
            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-gray-500">
              {topBuilds.length}
              {' '}
              种组合 · 最佳
              {formatAvg(topBuilds[0]?.avg)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

TransitionLevelRow.displayName = 'TransitionLevelRow'

export const TransitionTab = memo(({ earlyOptions, options }: TransitionTabProps) => {
  const { sortUnitsByCost } = useUnitsUtils()

  const earlyBuilds = useMemo(
    () => parseOptions(earlyOptions ?? {}, sortUnitsByCost),
    [earlyOptions, sortUnitsByCost],
  )

  const lateBuilds = useMemo(
    () => parseOptions(options ?? {}, sortUnitsByCost).filter(lb => lb.level !== '11'),
    [options, sortUnitsByCost],
  )

  const { transitions, coreUnits } = useMemo(() => {
    const levelMap = new Map<string, typeof earlyBuilds[0]>()
    for (const lb of earlyBuilds)
      levelMap.set(lb.level, lb)
    for (const lb of lateBuilds)
      levelMap.set(lb.level, lb)

    const allLevelBuilds = Array.from(levelMap.values()).sort((a, b) => Number(a.level) - Number(b.level))
    if (allLevelBuilds.length === 0)
      return { transitions: [], coreUnits: [] }

    const lastLevel = allLevelBuilds[allLevelBuilds.length - 1]!
    const coreUnits = extractCoreUnits(lastLevel.builds)
    const transitionLevels = allLevelBuilds.slice(0, -1)
    const transitions = analyzeTransitions(transitionLevels, coreUnits, allLevelBuilds)

    return { transitions, coreUnits }
  }, [earlyBuilds, lateBuilds])

  if (transitions.length === 0) {
    return <EmptyState message="暂无过渡阵容" />
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-55px)] sm:h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-3 p-2 px-3">
          <div className="flex items-center gap-4 px-1 text-[10px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="size-4 rounded bg-zinc-600" />
              <span>核心</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-4 rounded bg-zinc-600 opacity-50" />
              <span>过渡</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="relative size-4 rounded bg-zinc-600 opacity-30">
                <div className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-blue-400" />
              </div>
              <span>灵活</span>
            </div>
          </div>

          <div className="space-y-2">
            {transitions.map(trans => (
              <TransitionLevelRow key={trans.level} transition={trans} coreUnits={coreUnits} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

TransitionTab.displayName = 'TransitionTab'
