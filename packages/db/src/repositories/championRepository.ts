import type { Filter, FindOptions } from 'mongodb'
import type { ChampionMeta } from 'types'
import type { MongoDBManager } from '../client'
import type { ChampionDocument } from '../models/champion'
import { COLLECTION_NAME } from '../models/champion'

export class ChampionRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection() {
    return this.db.getDb().collection<ChampionDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ cost: 1 })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 批量插入或更新英雄 */
  async upsertMany(champions: ChampionMeta[]) {
    const collection = this.getCollection()
    const now = new Date()

    const operations = champions.map(champion => ({
      updateOne: {
        filter: { name: champion.name },
        update: {
          $set: {
            ...champion,
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
  async find(filter: Filter<ChampionDocument> = {}, options?: FindOptions<ChampionDocument>) {
    return await this.getCollection().find(filter, options).toArray()
  }

  /** 通用计数方法 */
  async count(filter: Filter<ChampionDocument> = {}) {
    return await this.getCollection().countDocuments(filter)
  }

  /** 根据名称查找英雄 */
  async findByName(name: string) {
    return await this.getCollection().findOne({ name })
  }

  /** 根据费用查找英雄 */
  async findByCost(cost: number) {
    return await this.getCollection().find({ cost }).toArray()
  }

  /** 获取所有英雄，按排名排序 */
  async findAll() {
    return await this.getCollection().find({}).sort({ rank: 1 }).toArray()
  }

  /** 获取前 N 名英雄 */
  async findTopN(n: number) {
    return await this.getCollection().find({}).sort({ rank: 1 }).limit(n).toArray()
  }

  /** 删除所有数据 */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }
}
