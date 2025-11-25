import type { ItemStat } from 'types'
import type { Items } from '../quicktype/gen/data'
import { calcAvg, calcFirstRate, calcPickRate, countFromPlaces, normalizeTop8 } from './common'

export function transformItemsStats(items: Items): ItemStat[] {
  const totalMatches = items.games?.[0]?.count || 0
  const results = items.results || []
  return results.map((it) => {
    const top8 = normalizeTop8(it.places)
    const count = countFromPlaces(top8)
    const avg = calcAvg(top8, count)
    const firstRate = calcFirstRate(top8, count)
    const pickRate = calcPickRate(count, totalMatches)
    return {
      itemName: it.itemName || '',
      avg,
      firstRate,
      pickRate,
    }
  })
}
