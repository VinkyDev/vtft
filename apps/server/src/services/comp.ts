import type { Comp, CompDetail } from 'types'
import { databaseService } from './database'

class CompService {
  async list(queue?: string): Promise<Comp[]> {
    const db = databaseService.getTFTDatabase()
    const data = queue ? await db.comps.find({ queue }) : await db.comps.find()
    return data as Comp[]
  }

  async getDetails(compId: string): Promise<CompDetail | null> {
    const db = databaseService.getTFTDatabase()
    return await db.compDetails.getDetails(compId)
  }
}

export const compService = new CompService()
