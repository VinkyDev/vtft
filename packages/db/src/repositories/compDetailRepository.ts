import type { BulkWriteResult, Collection, DeleteResult, UpdateResult, WithId } from 'mongodb'
import type { CompDetail } from 'types'
import type { MongoDBManager } from '../client'
import type { CompDetailDocument } from '../models/compDetail'
import { COLLECTION_NAME } from '../models/compDetail'

export class CompDetailRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection(): Collection<CompDetailDocument> {
    return this.db.getDb().collection<CompDetailDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ compId: 1 }, { unique: true })
    await collection.createIndex({ queue: 1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 插入或更新阵容详情 */
  async upsert(compId: string, details: CompDetail, queue: string): Promise<UpdateResult<CompDetailDocument> | null> {
    const collection = this.getCollection()
    const now = new Date()

    return await collection.updateOne(
      { compId },
      {
        $set: {
          compId,
          queue,
          details,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    )
  }

  /** 批量插入或更新阵容详情 */
  async upsertMany(detailsList: Array<{ compId: string, details: CompDetail, queue: string }>): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const now = new Date()

    const operations = detailsList.map(({ compId, details, queue }) => ({
      updateOne: {
        filter: { compId },
        update: {
          $set: { compId, queue, details, updatedAt: now },
          $setOnInsert: { createdAt: now },
        },
        upsert: true,
      },
    }))

    if (operations.length > 0) {
      return await collection.bulkWrite(operations)
    }
  }

  /** 根据 compId 查找详情 */
  async findByCompId(compId: string): Promise<WithId<CompDetailDocument> | null> {
    return await this.getCollection().findOne({ compId })
  }

  /** 获取详情内容 */
  async getDetails(compId: string): Promise<CompDetail | null> {
    const doc = await this.findByCompId(compId)
    return doc?.details || null
  }

  /** 删除所有数据 */
  async deleteAll(): Promise<DeleteResult> {
    return await this.getCollection().deleteMany({})
  }

  async deleteOlderThan(days: number): Promise<DeleteResult> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return await this.getCollection().deleteMany({ updatedAt: { $lt: cutoff } })
  }
}
