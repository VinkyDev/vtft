import type { BulkWriteResult, WithId } from 'mongodb'
import type { ChampionMeta } from 'types'
import type { ChampionDocument } from '../models/champion'
import { COLLECTION_NAME } from '../models/champion'
import { BaseRepository } from './BaseRepository'

export class ChampionRepository extends BaseRepository<ChampionDocument, ChampionMeta> {
  /** 获取集合名称 */
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  /** 初始化索引 */
  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ cost: 1 })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ updatedAt: -1 })
    await collection.createIndex({ cost: 1, rank: 1 })
    await collection.createIndex({ cost: 1, avgPlace: 1 })
  }

  /** 批量插入或更新英雄 */
  async upsertMany(champions: ChampionMeta[]): Promise<BulkWriteResult | undefined> {
    return await super.upsertMany(champions, {
      uniqueField: 'name',
      getFilterKey: item => item.name,
    })
  }

  /** 根据费用查找英雄 */
  async findByCost(cost: number): Promise<WithId<ChampionDocument>[]> {
    return await this.getCollection().find({ cost }).toArray()
  }

  /** 获取所有英雄，按排名排序 */
  async findAll(): Promise<WithId<ChampionDocument>[]> {
    return await super.findAll('rank' as keyof ChampionDocument, 1)
  }

  /** 获取前 N 名英雄 */
  async findTopN(n: number): Promise<WithId<ChampionDocument>[]> {
    return await this.getCollection().find({}).sort({ rank: 1 }).limit(n).toArray()
  }
}
