import type { UnitStat } from 'types'
import type { Units } from '../quicktype/gen/data'
import { calcAvg, calcFirstRate, calcPickRate, calcTop4Rate, countFromPlaces, normalizeTop8 } from './common'

export function transformUnitsStats(units: Units): UnitStat[] {
  const totalMatches = units.games?.[0]?.count || 0
  const results = units.results || []
  return results.map((it) => {
    const top8 = normalizeTop8(it.places)
    const count = countFromPlaces(top8)
    const avg = calcAvg(top8, count)
    const firstRate = calcFirstRate(top8, count)
    const pickRate = calcPickRate(count, totalMatches)
    const top4Rate = calcTop4Rate(top8, count)
    return {
      unit: it.unit || '',
      avg,
      firstRate,
      pickRate,
      top4Rate,
    }
  })
}
