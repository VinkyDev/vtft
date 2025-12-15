export function parseUnitList(str?: string): string[] {
  if (!str)
    return []
  return str.split('&').map(s => s.trim()).filter(Boolean)
}

export function formatAvg(avg?: number): string {
  if (avg === undefined || avg === null)
    return '-'
  return Number.isFinite(avg) ? avg.toFixed(2) : '-'
}

export function findCommonUnits(builds: Array<{ units: string[] }>): string[] {
  if (builds.length === 0)
    return []
  if (builds.length === 1)
    return builds[0]!.units

  const unitSets = builds.map(build => new Set(build.units))
  const firstSet = unitSets[0]!

  return Array.from(firstSet).filter(unit =>
    unitSets.every(set => set.has(unit)),
  )
}

export function alignUnits(units: string[], commonUnits: string[]): { common: (string | null)[], others: string[] } {
  const unitSet = new Set(units)
  const commonAligned = commonUnits.map(u => unitSet.has(u) ? u : null)
  const others = units.filter(u => !commonUnits.includes(u))
  return { common: commonAligned, others }
}
