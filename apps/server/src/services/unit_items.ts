import type { UnitItemsProcessed } from 'types'
import { databaseService } from './database'

class UnitItemsService {
  async get(): Promise<UnitItemsProcessed | null> {
    const db = databaseService.getTFTDatabase()
    const data = await db.unitItemsProcessed.get()
    return data
  }
}

export const unitItemsService = new UnitItemsService()
