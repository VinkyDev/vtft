import type { Lookups } from 'types'
import { databaseService } from './database'

class LookupsService {
  async get(season?: string): Promise<Lookups | null> {
    const db = databaseService.getTFTDatabase()
    const data = await db.lookups.get(season)
    return data
  }
}

export const lookupsService = new LookupsService()
