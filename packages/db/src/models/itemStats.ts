import type { ItemStat } from 'types'

export interface ItemStatsDocument extends ItemStat {
  queue: string
  key: string
  createdAt: Date
  updatedAt: Date
}

export const COLLECTION_NAME = 'items_stats'
