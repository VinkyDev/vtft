import type { BulkWriteResult, DeleteResult, WithId } from 'mongodb'
import type { Comp } from 'types'
import type { CompDocument } from '../models/comp'
import { generateCompId } from 'utils'
import { COLLECTION_NAME } from '../models/comp'
import { BaseRepository } from './BaseRepository'

export class CompRepository extends BaseRepository<CompDocument, CompDocument> {
  /** 获取集合名称 */
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  /** 初始化索引 */
  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ compId: 1 }, { unique: true })
    await collection.createIndex({ name: 1 })
    await collection.createIndex({ queue: 1 })
    await collection.createIndex({ pickRate: -1 })
    await collection.createIndex({ top4Rate: -1 })
    await collection.createIndex({ avg: 1 })
    await collection.createIndex({ name: 'text' })
  }

  /** 批量插入或更新阵容 */
  async upsertManyByQueue(comps: Comp[], queue: string): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const client = this.db.getClient()

    const now = new Date()
    const operations = [
      { deleteMany: { filter: { queue } } },
      ...comps.map(comp => ({
        updateOne: {
          filter: { compId: generateCompId(comp, queue) },
          update: {
            $set: {
              ...comp,
              compId: generateCompId(comp, queue),
              queue,
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

  async deleteByQueue(queue: string): Promise<DeleteResult> {
    return await this.getCollection().deleteMany({ queue })
  }

  /** 根据 compId 查找阵容 */
  async findByCompId(compId: string): Promise<WithId<CompDocument> | null> {
    return await this.getCollection().findOne({ compId })
  }

  /** 获取所有阵容，按排名排序(带分页) */
  async findAll(): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({}).toArray()
  }

  /** 根据评级查找阵容 */
  async findByTrait(trait: string): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({ traits: trait }).toArray()
  }

  /** 根据等级类型查找阵容 */
  async findByUnit(unit: string): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({ units: unit }).toArray()
  }

  /** 获取热门阵容（按挑选率排序） */
  async findPopular(limit: number = 10): Promise<WithId<CompDocument>[]> {
    return await this.getCollection()
      .find({ pickRate: { $exists: true } })
      .sort({ pickRate: -1 })
      .limit(limit)
      .toArray()
  }

  /** 获取高胜率阵容 */
  async findHighWinRate(limit: number = 10): Promise<WithId<CompDocument>[]> {
    return await this.getCollection()
      .find({ top4Rate: { $exists: true } })
      .sort({ top4Rate: -1 })
      .limit(limit)
      .toArray()
  }
}
