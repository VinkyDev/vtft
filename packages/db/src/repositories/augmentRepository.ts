import type { Filter, FindOptions } from 'mongodb'
import type { AugmentLevel, AugmentMeta } from 'types'
import type { MongoDBManager } from '../client'
import type { AugmentDocument } from '../models/augment'
import { COLLECTION_NAME } from '../models/augment'

export class AugmentRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection() {
    return this.db.getDb().collection<AugmentDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ level: 1 })
    await collection.createIndex({ tier: 1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 批量插入或更新强化符文 */
  async upsertMany(augments: AugmentMeta[]) {
    const collection = this.getCollection()
    const now = new Date()

    const operations = augments.map(augment => ({
      updateOne: {
        filter: { name: augment.name },
        update: {
          $set: {
            ...augment,
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        upsert: true,
      },
    }))

    if (operations.length > 0) {
      return await collection.bulkWrite(operations)
    }
  }

  /** 通用查询方法 */
  async find(filter: Filter<AugmentDocument> = {}, options?: FindOptions<AugmentDocument>) {
    return await this.getCollection().find(filter, options).toArray()
  }

  /** 通用计数方法 */
  async count(filter: Filter<AugmentDocument> = {}) {
    return await this.getCollection().countDocuments(filter)
  }

  /** 根据名称查找强化符文 */
  async findByName(name: string) {
    return await this.getCollection().findOne({ name })
  }

  /** 根据级别查找强化符文 */
  async findByLevel(level: AugmentLevel) {
    return await this.getCollection().find({ level }).toArray()
  }

  /** 获取所有强化符文 */
  async findAll() {
    return await this.getCollection().find({}).sort({ name: 1 }).toArray()
  }

  /** 根据段位查找强化符文 */
  async findByTier(tier: string) {
    return await this.getCollection().find({ tier }).toArray()
  }

  /** 获取前 N 个强化符文（按排名排序） */
  async findTopN(limit: number = 10) {
    return await this.getCollection()
      .find({ rank: { $exists: true } })
      .sort({ rank: 1 })
      .limit(limit)
      .toArray()
  }

  /** 删除所有数据 */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }
}
