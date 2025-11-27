import type { TierList } from 'types'

export interface AugmentTierDocument extends TierList {
  createdAt: Date
  updatedAt: Date
}

export const COLLECTION_NAME = 'augments'
