import type { BulkWriteResult, UpdateResult } from 'mongodb'
import type { UnitItemsProcessed } from 'types'
import type { UnitItemsProcessedDocument } from '../models/unitItemsProcessed'
import { COLLECTION_NAME } from '../models/unitItemsProcessed'
import { BaseRepository } from './BaseRepository'

export class UnitItemsProcessedRepository extends BaseRepository<UnitItemsProcessedDocument, UnitItemsProcessedDocument> {
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ key: 1 }, { unique: true })
    await collection.createIndex({ updatedAt: -1 })
  }

  async upsert(data: UnitItemsProcessed): Promise<UpdateResult<UnitItemsProcessedDocument> | null> {
    const key = 'latest'
    const now = new Date()
    return await this.getCollection().updateOne(
      { key },
      { $set: { key, data, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true },
    )
  }

  async replace(data: UnitItemsProcessed): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const client = this.db.getClient()
    const now = new Date()
    const key = 'latest'

    const operations = [
      { deleteMany: { filter: {} } },
      {
        updateOne: {
          filter: { key },
          update: {
            $set: { key, data, updatedAt: now },
            $setOnInsert: { createdAt: now },
          },
          upsert: true,
        },
      },
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

  async get(): Promise<UnitItemsProcessed | null> {
    const doc = await this.find({ key: 'latest' }, { limit: 1 }).then(d => d[0] || null)
    return doc?.data ?? null
  }
}
