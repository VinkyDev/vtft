import type { CompsStats } from '../quicktype/gen/comps'

import { calcAvg, calcFirstRate, calcPickRate, calcTop4Rate, countFromPlaces, normalizeTop8 } from './common'

interface ParsedCluster {
  avg: number
  pickRate: number
  top4Rate: number
  firstRate: number
}

export function transformCompsStats(data: CompsStats): Record<string, ParsedCluster> {
  let totalMatches = 0

  for (const item of data.results || []) {
    if (item.cluster === '') {
      totalMatches = item.places?.[0] || 0
      break
    }
  }

  if (!totalMatches)
    throw new Error('Missing total matches (cluster: \'\')')

  const result: Record<string, ParsedCluster> = {}

  for (const item of data.results || []) {
    const { cluster, places } = item
    if (!cluster)
      continue
    if (cluster === '')
      continue

    const top8 = normalizeTop8(places)
    const count = countFromPlaces(top8, item.count)
    const avg = calcAvg(top8, count)
    const pickRate = calcPickRate(count, totalMatches)
    const firstRate = calcFirstRate(top8, count)
    const top4Rate = calcTop4Rate(top8, count)

    result[cluster] = { avg, pickRate, firstRate, top4Rate }
  }

  return result
}

export type { ParsedCluster }
