import type { AugmentLevel, AugmentMeta } from 'types'
import type { AugmentDocument } from '../models/augment'
import { COLLECTION_NAME } from '../models/augment'
import { BaseRepository } from './BaseRepository'

export class AugmentRepository extends BaseRepository<AugmentDocument, AugmentMeta> {
  /** 获取集合名称 */
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  /** 初始化索引 */
  async createIndexes() {
    const collection = this.getCollection()
    await collection.createIndex({ name: 1 }, { unique: true })
    await collection.createIndex({ level: 1 })
    await collection.createIndex({ tier: 1 })
    await collection.createIndex({ updatedAt: -1 })
    await collection.createIndex({ level: 1, tier: 1 })
    await collection.createIndex({ rank: 1 })
  }

  /** 批量插入或更新强化符文 */
  async upsertMany(augments: AugmentMeta[]) {
    return await super.upsertMany(augments, {
      uniqueField: 'name',
      getFilterKey: item => item.name,
    })
  }

  /** 根据级别查找强化符文 */
  async findByLevel(level: AugmentLevel) {
    return await this.getCollection().find({ level }).toArray()
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
}
