import type { UnitStat } from 'types'
import { databaseService } from './database'

class UnitService {
  async list(queue?: string): Promise<UnitStat[]> {
    const db = databaseService.getTFTDatabase()
    const data = queue
      ? await db.unitsStats.find({ queue }, { sort: { pickRate: -1 } })
      : await db.unitsStats.findAll()
    return data as UnitStat[]
  }
}

export const championService = new UnitService()
