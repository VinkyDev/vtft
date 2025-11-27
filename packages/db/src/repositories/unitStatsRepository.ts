import type { BulkWriteResult, DeleteResult, WithId } from 'mongodb'
import type { UnitStat } from 'types'
import type { UnitStatsDocument } from '../models/unitStats'
import { COLLECTION_NAME } from '../models/unitStats'
import { BaseRepository } from './BaseRepository'

export class UnitStatsRepository extends BaseRepository<UnitStatsDocument, UnitStatsDocument> {
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ key: 1 }, { unique: true })
    await collection.createIndex({ queue: 1 })
    await collection.createIndex({ pickRate: -1 })
    await collection.createIndex({ firstRate: -1 })
    await collection.createIndex({ avg: 1 })
  }

  async clearByQueue(queue: string): Promise<DeleteResult> {
    return await this.getCollection().deleteMany({ queue })
  }

  async replaceAll(units: UnitStat[], queue: string): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const client = this.db.getClient()
    const now = new Date()

    const operations = [
      { deleteMany: { filter: { queue } } },
      ...units.map(u => ({
        updateOne: {
          filter: { key: `${queue}:${u.unit}` },
          update: {
            $set: {
              ...(u),
              queue,
              key: `${queue}:${u.unit}`,
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

  async findAll(): Promise<WithId<UnitStatsDocument>[]> {
    return await super.findAll('pickRate' as keyof UnitStatsDocument, -1)
  }

  async findByQueue(queue: string): Promise<WithId<UnitStatsDocument>[]> {
    return await this.getCollection().find({ queue }).sort({ pickRate: -1 }).toArray()
  }
}
