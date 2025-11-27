import type { UnitItemsProcessed } from 'types'

export interface UnitItemsProcessedDocument {
  key: string
  data: UnitItemsProcessed
  createdAt: Date
  updatedAt: Date
}

export const COLLECTION_NAME = 'unit_items_processed'
