import type { CompData, CompDetails } from 'types'
import type { MongoDBManager } from '../client'
import type { CompDetailDocument } from '../models/compDetail'
import { COLLECTION_NAME } from '../models/compDetail'

export class CompDetailRepository {
  constructor(private db: MongoDBManager) {}

  /** 获取集合 */
  private getCollection() {
    return this.db.getDb().collection<CompDetailDocument>(COLLECTION_NAME)
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ compId: 1 }, { unique: true })
    await collection.createIndex({ updatedAt: -1 })
  }

  /** 生成阵容 ID（与 CompRepository 保持一致） */
  private generateCompId(comp: CompData): string {
    return `${comp.name}_${comp.champions.length}`
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  /** 插入或更新阵容详情 */
  async upsert(comp: CompData) {
    if (!comp.details) {
      return null
    }

    const collection = this.getCollection()
    const compId = this.generateCompId(comp)
    const now = new Date()

    return await collection.updateOne(
      { compId },
      {
        $set: {
          compId,
          details: comp.details,
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
  async upsertMany(comps: CompData[]) {
    const collection = this.getCollection()
    const now = new Date()

    const operations = comps
      .filter(comp => comp.details)
      .map((comp) => {
        const compId = this.generateCompId(comp)

        return {
          updateOne: {
            filter: { compId },
            update: {
              $set: {
                compId,
                details: comp.details,
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

  /** 根据 compId 查找详情 */
  async findByCompId(compId: string) {
    return await this.getCollection().findOne({ compId })
  }

  /** 获取详情内容 */
  async getDetails(compId: string): Promise<CompDetails | null> {
    const doc = await this.findByCompId(compId)
    return doc?.details || null
  }

  /** 删除所有数据 */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }
}
