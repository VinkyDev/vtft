import type { Lookups } from 'types'

export interface LookupsDocument {
  key: string
  season: string
  queue: string
  data: Lookups
  createdAt: Date
  updatedAt: Date
}

export const COLLECTION_NAME = 'lookups'
