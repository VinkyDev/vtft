import type { Filter, FindOptions } from 'mongodb'
import type { CompData } from 'types'
import type { MongoDBManager } from '../client'
import type { CompDocument } from '../models/comp'
import { COLLECTION_NAME } from '../models/comp'

export class CompRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection() {
    return this.db.getDb().collection<CompDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ compId: 1 }, { unique: true })
    await collection.createIndex({ name: 1 })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ tier: 1 })
    await collection.createIndex({ levelType: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ pickRate: -1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 生成阵容 ID（根据名称和等级） */
  private generateCompId(comp: CompData): string {
    return `${comp.name}_${comp.champions.length}`
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  /** 批量插入或更新阵容（不含 details） */
  async upsertMany(comps: CompData[]) {
    const collection = this.getCollection()
    const now = new Date()

    const operations = comps.map((comp) => {
      const compId = this.generateCompId(comp)
      const { details, ...compWithoutDetails } = comp

      return {
        updateOne: {
          filter: { compId },
          update: {
            $set: {
              ...compWithoutDetails,
              compId,
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          upsert: true,
        },
      }
    })

    if (operations.length > 0) {
      return await collection.bulkWrite(operations)
    }
  }

  /** 通用查询方法 */
  async find(filter: Filter<CompDocument> = {}, options?: FindOptions<CompDocument>) {
    return await this.getCollection().find(filter, options).toArray()
  }

  /** 通用计数方法 */
  async count(filter: Filter<CompDocument> = {}) {
    return await this.getCollection().countDocuments(filter)
  }

  /** 根据 compId 查找阵容 */
  async findByCompId(compId: string) {
    return await this.getCollection().findOne({ compId })
  }

  /** 根据名称查找阵容 */
  async findByName(name: string) {
    return await this.getCollection().find({ name }).toArray()
  }

  /** 获取所有阵容，按排名排序 */
  async findAll(options?: { limit?: number, skip?: number }) {
    const query = this.getCollection().find({}).sort({ rank: 1 })

    if (options?.skip)
      query.skip(options.skip)
    if (options?.limit)
      query.limit(options.limit)

    return await query.toArray()
  }

  /** 根据评级查找阵容 */
  async findByTier(tier: string) {
    return await this.getCollection().find({ tier }).sort({ rank: 1 }).toArray()
  }

  /** 根据等级类型查找阵容 */
  async findByLevelType(levelType: string) {
    return await this.getCollection().find({ levelType }).sort({ rank: 1 }).toArray()
  }

  /** 获取热门阵容（按挑选率排序） */
  async findPopular(limit: number = 10) {
    return await this.getCollection()
      .find({ pickRate: { $exists: true } })
      .sort({ pickRate: -1 })
      .limit(limit)
      .toArray()
  }

  /** 获取高胜率阵容 */
  async findHighWinRate(limit: number = 10) {
    return await this.getCollection()
      .find({ top4Rate: { $exists: true } })
      .sort({ top4Rate: -1 })
      .limit(limit)
      .toArray()
  }

  /** 删除所有数据 */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }
}
