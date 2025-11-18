import type { BulkWriteResult, WithId } from 'mongodb'
import type { CompData } from 'types'
import type { CompDocument } from '../models/comp'
import { COLLECTION_NAME } from '../models/comp'
import { BaseRepository } from './BaseRepository'

export class CompRepository extends BaseRepository<CompDocument, CompData> {
  /** 获取集合名称 */
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  /** 初始化索引 */
  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ compId: 1 }, { unique: true })
    await collection.createIndex({ name: 1 })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ tier: 1 })
    await collection.createIndex({ levelType: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ pickRate: -1 })
    await collection.createIndex({ name: 'text' })
    await collection.createIndex({ tier: 1, rank: 1 })
    await collection.createIndex({ levelType: 1, rank: 1 })
    await collection.createIndex({ tier: 1, levelType: 1, rank: 1 })
  }

  /** 生成阵容 ID */
  private generateCompId(comp: CompData): string {
    return `${comp.name}_${comp.champions.length}_${comp.rank}`
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  /** 批量插入或更新阵容（不含 details） */
  async upsertMany(comps: CompData[]): Promise<BulkWriteResult | undefined> {
    return await super.upsertMany(
      comps.map(({ details, ...comp }) => ({
        ...comp,
        compId: this.generateCompId(comp),
      } as CompData)),
      {
        uniqueField: 'compId',
        getFilterKey: comp => comp.compId,
      },
    )
  }

  /** 根据 compId 查找阵容 */
  async findByCompId(compId: string): Promise<WithId<CompDocument> | null> {
    return await this.getCollection().findOne({ compId })
  }

  /** 获取所有阵容，按排名排序(带分页) */
  async findAllPaginated(options?: { limit?: number, skip?: number }): Promise<WithId<CompDocument>[]> {
    const query = this.getCollection().find({}).sort({ rank: 1 })

    if (options?.skip)
      query.skip(options.skip)
    if (options?.limit)
      query.limit(options.limit)

    return await query.toArray()
  }

  /** 根据名称查找多个阵容 */
  async findManyByName(name: string): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({ name }).toArray()
  }

  /** 根据评级查找阵容 */
  async findByTier(tier: string): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({ tier }).sort({ rank: 1 }).toArray()
  }

  /** 根据等级类型查找阵容 */
  async findByLevelType(levelType: string): Promise<WithId<CompDocument>[]> {
    return await this.getCollection().find({ levelType }).sort({ rank: 1 }).toArray()
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
