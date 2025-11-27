import type { ItemStat } from 'types'
import { databaseService } from './database'

class ItemService {
  async list(queue?: string): Promise<ItemStat[]> {
    const db = databaseService.getTFTDatabase()
    const data = queue
      ? await db.itemsStats.find({ queue }, { sort: { pickRate: -1 } })
      : await db.itemsStats.findAll()
    return data as unknown as ItemStat[]
  }
}

export const itemService = new ItemService()
