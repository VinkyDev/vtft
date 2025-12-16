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

// 根据等级获取允许的最大棋子费用
function getMaxCostForLevel(level: number): number {
  if (level < 5)
    return 3
  if (level < 7)
    return 4
  return 5
}

interface ParsedBuild {
  units: string[]
  count: number
  avg: number
}

export interface LevelBuilds {
  level: string
  builds: ParsedBuild[]
}

export interface UnitAnalysis {
  unit: string
  count: number
  rate: number
  category: 'core' | 'recommended' | 'optional'
}

export interface TransitionAnalysis {
  level: string
  totalGames: number
  core: UnitAnalysis[]
  recommended: UnitAnalysis[]
  optional: UnitAnalysis[]
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

const RECOMMENDED_THRESHOLD = 0.25
const OPTIONAL_THRESHOLD = 0.08

export function analyzeTransitions(
  transitionLevels: LevelBuilds[],
  finalCoreUnits: string[],
  getUnitCost: (unitId: string) => number,
): TransitionAnalysis[] {
  return transitionLevels.map((levelBuild) => {
    const level = Number(levelBuild.level)
    const maxCost = getMaxCostForLevel(level)
    const unitStats = new Map<string, number>()

    let totalGames = 0
    for (const build of levelBuild.builds) {
      totalGames += build.count
      for (const unit of build.units) {
        const cost = getUnitCost(unit)
        if (cost <= maxCost) {
          unitStats.set(unit, (unitStats.get(unit) ?? 0) + build.count)
        }
      }
    }

    const allUnits = Array.from(unitStats.entries())
      .map(([unit, count]) => {
        const rate = totalGames > 0 ? count / totalGames : 0
        const cost = getUnitCost(unit)
        const isCoreFinal = finalCoreUnits.includes(unit)
        // 8级及以下，5费卡不作为核心（9级才大量找5费）
        const canBeCore = isCoreFinal && (level >= 9 || cost < 5)

        let category: 'core' | 'recommended' | 'optional'
        if (canBeCore) {
          category = 'core'
        }
        else if (rate >= RECOMMENDED_THRESHOLD) {
          category = 'recommended'
        }
        else {
          category = 'optional'
        }
        return { unit, count, rate, category }
      })
      .filter(u => u.rate >= OPTIONAL_THRESHOLD)
      .sort((a, b) => b.rate - a.rate)

    const core = allUnits.filter(u => u.category === 'core')
    const recommended = allUnits.filter(u => u.category === 'recommended')
    const optional = allUnits.filter(u => u.category === 'optional')

    return {
      level: levelBuild.level,
      totalGames,
      core,
      recommended,
      optional,
    }
  })
}
