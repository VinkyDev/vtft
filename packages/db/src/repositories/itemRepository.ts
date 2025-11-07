import type { ItemMeta } from 'types'
import type { ItemDocument } from '../models/item'
import { COLLECTION_NAME } from '../models/item'
import { BaseRepository } from './BaseRepository'

export class ItemRepository extends BaseRepository<ItemDocument, ItemMeta> {
  /** 获取集合名称 */
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ rank: 1 })
    await collection.createIndex({ avgPlace: 1 })
    await collection.createIndex({ updatedAt: -1 })
    await collection.createIndex({ recommendedFor: 1 })
  }

  /** 批量插入或更新装备 */
  async upsertMany(items: ItemMeta[]) {
    return await super.upsertMany(items, {
      uniqueField: 'name',
      getFilterKey: item => item.name,
    })
  }

  /** 获取所有装备，按排名排序 */
  async findAll() {
    return await super.findAll('rank' as keyof ItemDocument, 1)
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
}
