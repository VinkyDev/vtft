import type { UnitStat } from 'types'

export interface UnitStatsDocument extends UnitStat {
  queue: string
  key: string
  createdAt: Date
  updatedAt: Date
}

export const COLLECTION_NAME = 'units_stats'
