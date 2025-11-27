import type { BulkWriteResult, WithId } from 'mongodb'
import type { TierList } from 'types'
import type { AugmentTierDocument } from '../models/augmentTier'
import { COLLECTION_NAME } from '../models/augmentTier'
import { BaseRepository } from './BaseRepository'

export class AugmentTierRepository extends BaseRepository<AugmentTierDocument, TierList> {
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ label: 1 }, { unique: true })
  }

  async replaceAll(tiers: TierList[]): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const client = this.db.getClient()
    const now = new Date()

    const operations = [
      { deleteMany: { filter: {} } },
      ...tiers.map(item => ({
        updateOne: {
          filter: { label: item.label ?? '' },
          update: {
            $set: {
              ...(item),
              label: item.label ?? '',
              updatedAt: now,
            },
            $setOnInsert: { createdAt: now },
          },
          upsert: true,
        },
      })),
    ]

    if (client) {
      const session = client.startSession()
      try {
        let result: BulkWriteResult | undefined
        await session.withTransaction(async () => {
          result = await collection.bulkWrite(operations, { ordered: true, session })
        }, { writeConcern: { w: 'majority' } })
        return result
      }
      finally {
        await session.endSession()
      }
    }

    return await collection.bulkWrite(operations, { ordered: true })
  }

  async findAll(): Promise<WithId<AugmentTierDocument>[]> {
    return await this.getCollection().find({}).toArray()
  }
}
