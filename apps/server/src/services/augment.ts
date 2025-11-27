import type { TierList } from 'types'
import { databaseService } from './database'

class AugmentService {
  async list(): Promise<TierList[]> {
    const db = databaseService.getTFTDatabase()
    const all = await db.augments.find()
    return all as unknown as TierList[]
  }
}

export const augmentService = new AugmentService()
