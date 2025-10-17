import type { Filter, FindOptions } from 'mongodb'
import type { ItemMeta } from 'types'
import type { MongoDBManager } from '../client'
import type { ItemDocument } from '../models/item'
import { COLLECTION_NAME } from '../models/item'

export class ItemRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection() {
    return this.db.getDb().collection<ItemDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 批量插入或更新装备 */
  async upsertMany(items: ItemMeta[]) {
    const collection = this.getCollection()
    const now = new Date()

    const operations = items.map(item => ({
      updateOne: {
        filter: { name: item.name },
        update: {
          $set: {
            ...item,
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
  async find(filter: Filter<ItemDocument> = {}, options?: FindOptions<ItemDocument>) {
    return await this.getCollection().find(filter, options).toArray()
  }

  /** 通用计数方法 */
  async count(filter: Filter<ItemDocument> = {}) {
    return await this.getCollection().countDocuments(filter)
  }

  /** 根据名称查找装备 */
  async findByName(name: string) {
    return await this.getCollection().findOne({ name })
  }

  /** 获取所有装备，按排名排序 */
  async findAll() {
    return await this.getCollection().find({}).sort({ rank: 1 }).toArray()
  }

  /** 获取前 N 名装备 */
  async findTopN(n: number) {
    return await this.getCollection().find({}).sort({ rank: 1 }).limit(n).toArray()
  }

  /** 根据推荐英雄查找装备 */
  async findByRecommendedChampion(championName: string) {
    return await this.getCollection()
      .find({ recommendedFor: championName })
      .sort({ rank: 1 })
      .toArray()
  }

  /** 删除所有数据 */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }
}
