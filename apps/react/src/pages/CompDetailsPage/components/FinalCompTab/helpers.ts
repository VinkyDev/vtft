import type { LookupsUnit, Option, Trait } from 'types'

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

export interface ParsedBuild {
  units: string[]
  count: number
  avg: number
}

interface LevelBuilds {
  level: string
  builds: ParsedBuild[]
}

interface FlexSlot {
  options: Array<{ unit: string, count: number, avgRank: number }>
}

interface FinalCompAnalysis {
  coreUnits: string[]
  flexSlots: FlexSlot[]
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

export function analyzeFinalComp(builds: ParsedBuild[]): FinalCompAnalysis {
  const topBuilds = builds.slice(0, 10)

  if (topBuilds.length === 0) {
    return { coreUnits: [], flexSlots: [], topBuilds: [] }
  }

  const unitStats = new Map<string, { count: number, weightedCount: number, totalAvg: number }>()

  for (const build of topBuilds) {
    for (const unit of build.units) {
      const stats = unitStats.get(unit) ?? { count: 0, weightedCount: 0, totalAvg: 0 }
      stats.count += 1
      stats.weightedCount += build.count
      stats.totalAvg += build.avg * build.count
      unitStats.set(unit, stats)
    }
  }

  const coreThreshold = Math.ceil(topBuilds.length * 0.8)
  const coreUnits: string[] = []
  const flexUnitStats: Array<{ unit: string, count: number, avgRank: number }> = []

  for (const [unit, stats] of unitStats) {
    if (stats.count >= coreThreshold) {
      coreUnits.push(unit)
    }
    else {
      flexUnitStats.push({
        unit,
        count: stats.weightedCount,
        avgRank: stats.totalAvg / stats.weightedCount,
      })
    }
  }

  flexUnitStats.sort((a, b) => b.count - a.count)

  const flexSlots: FlexSlot[] = flexUnitStats.length > 0 ? [{ options: flexUnitStats }] : []

  return {
    coreUnits,
    flexSlots,
    topBuilds: topBuilds.slice(0, 5),
  }
}

export function calculateTraits(
  units: string[],
  unitsById: Record<string, LookupsUnit>,
  traitsById: Record<string, Trait>,
): Array<{ traitId: string, level: number, count: number }> {
  const traitCounts = new Map<string, number>()

  for (const unitId of units) {
    const unit = unitsById[unitId]
    if (!unit?.traits)
      continue

    for (const traitName of unit.traits) {
      const trait = Object.values(traitsById).find(t => t.name === traitName)
      if (trait?.apiName) {
        traitCounts.set(trait.apiName, (traitCounts.get(trait.apiName) ?? 0) + 1)
      }
    }
  }

  const result: Array<{ traitId: string, level: number, count: number }> = []

  for (const [traitApiName, count] of traitCounts) {
    const trait = traitsById[traitApiName]
    if (!trait?.effects)
      continue

    let activatedLevel = 0
    for (let i = 0; i < trait.effects.length; i++) {
      const effect = trait.effects[i]
      if (effect?.minUnits && count >= effect.minUnits) {
        activatedLevel = i + 1
      }
    }

    if (activatedLevel > 0) {
      result.push({ traitId: `${traitApiName}_${activatedLevel}`, level: activatedLevel, count })
    }
  }

  return result.sort((a, b) => b.level - a.level)
}
