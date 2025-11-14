import type { MongoDBManager } from './client'
import {
  AugmentRepository,
  ChampionRepository,
  CompDetailRepository,
  CompRepository,
  ItemRepository,
} from './repositories'

/**
 * TFT 数据库服务
 * 提供所有数据访问仓储的统一入口
 */
export class TFTDatabase {
  public augments: AugmentRepository
  public champions: ChampionRepository
  public items: ItemRepository
  public comps: CompRepository
  public compDetails: CompDetailRepository

  constructor(private dbManager: MongoDBManager) {
    this.augments = new AugmentRepository(dbManager)
    this.champions = new ChampionRepository(dbManager)
    this.items = new ItemRepository(dbManager)
    this.comps = new CompRepository(dbManager)
    this.compDetails = new CompDetailRepository(dbManager)
  }

  /**
   * 初始化所有集合的索引
   */
  async initializeIndexes() {
    await Promise.all([
      this.augments.createIndexes(),
      this.champions.createIndexes(),
      this.items.createIndexes(),
      this.comps.createIndexes(),
      this.compDetails.createIndexes(),
    ])
  }

  /**
   * 清空所有数据
   */
  async clearAll() {
    await Promise.all([
      this.augments.deleteAll(),
      this.champions.deleteAll(),
      this.items.deleteAll(),
      this.comps.deleteAll(),
      this.compDetails.deleteAll(),
    ])
  }
}

/**
 * 创建 TFT 数据库实例
 */
export function createTFTDatabase(dbManager: MongoDBManager): TFTDatabase {
  return new TFTDatabase(dbManager)
}
