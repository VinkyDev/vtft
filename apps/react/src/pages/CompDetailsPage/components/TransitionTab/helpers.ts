import type { Option } from 'types'

function parseUnitList(str?: string): string[] {
  if (!str)
    return []
  return str.split('&').map(s => s.trim()).filter(Boolean)
}

export function formatAvg(avg?: number): string {
  if (avg === undefined || avg === null)
    return '-'
  return Number.isFinite(avg) ? avg.toFixed(2) : '-'
}

interface ParsedBuild {
  units: string[]
  count: number
  avg: number
}

interface LevelBuilds {
  level: string
  builds: ParsedBuild[]
}

export interface TransitionAnalysis {
  level: string
  unitPool: Array<{
    unit: string
    count: number
    isCore: boolean
    isTransition: boolean
  }>
  topBuilds: ParsedBuild[]
}

export function parseOptions(
  options: Record<string, Option[]>,
  sortUnitsByCost: (units: string[]) => string[],
): LevelBuilds[] {
  return Object.entries(options)
    .map(([level, opts]) => {
      const builds = opts
        .filter(opt => opt.unit_list && opt.count)
        .map(opt => ({
          units: sortUnitsByCost(parseUnitList(opt.unit_list)),
          count: opt.count ?? 0,
          avg: opt.avg ?? 4.5,
        }))
        .sort((a, b) => b.count - a.count)

      return { level, builds }
    })
    .filter(lb => lb.builds.length > 0)
    .sort((a, b) => Number(a.level) - Number(b.level))
}

export function analyzeTransitions(
  transitionLevels: LevelBuilds[],
  finalCoreUnits: string[],
  allLevelBuilds: LevelBuilds[],
): TransitionAnalysis[] {
  const finalUnits = new Set<string>(finalCoreUnits)
  const lastLevel = allLevelBuilds[allLevelBuilds.length - 1]
  if (lastLevel) {
    for (const build of lastLevel.builds.slice(0, 5)) {
      for (const unit of build.units) {
        finalUnits.add(unit)
      }
    }
  }

  return transitionLevels.map((levelBuild) => {
    const unitStats = new Map<string, number>()

    for (const build of levelBuild.builds) {
      for (const unit of build.units) {
        unitStats.set(unit, (unitStats.get(unit) ?? 0) + build.count)
      }
    }

    const unitPool = Array.from(unitStats.entries())
      .map(([unit, count]) => ({
        unit,
        count,
        isCore: finalCoreUnits.includes(unit),
        isTransition: !finalUnits.has(unit),
      }))
      .sort((a, b) => {
        if (a.isCore !== b.isCore)
          return a.isCore ? -1 : 1
        return b.count - a.count
      })

    return {
      level: levelBuild.level,
      unitPool,
      topBuilds: levelBuild.builds.slice(0, 3),
    }
  })
}
