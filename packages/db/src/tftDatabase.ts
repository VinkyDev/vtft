import type { MongoDBManager } from './client'
import { CompDetailRepository, CompRepository, LookupsRepository } from './repositories'
import { AugmentTierRepository } from './repositories/augmentTierRepository'
import { ItemStatsRepository } from './repositories/itemStatsRepository'
import { UnitItemsProcessedRepository } from './repositories/unitItemsProcessedRepository'
import { UnitStatsRepository } from './repositories/unitStatsRepository'

/**
 * TFT 数据库服务
 * 提供所有数据访问仓储的统一入口
 */
export class TFTDatabase {
  public augments: AugmentTierRepository
  public itemsStats: ItemStatsRepository
  public unitsStats: UnitStatsRepository
  public unitItemsProcessed: UnitItemsProcessedRepository
  public comps: CompRepository
  public compDetails: CompDetailRepository
  public lookups: LookupsRepository

  constructor(dbManager: MongoDBManager) {
    this.augments = new AugmentTierRepository(dbManager)
    this.itemsStats = new ItemStatsRepository(dbManager)
    this.unitsStats = new UnitStatsRepository(dbManager)
    this.comps = new CompRepository(dbManager)
    this.compDetails = new CompDetailRepository(dbManager)
    this.lookups = new LookupsRepository(dbManager)
    this.unitItemsProcessed = new UnitItemsProcessedRepository(dbManager)
  }

  /**
   * 初始化所有集合的索引
   */
  async initializeIndexes(): Promise<void> {
    await Promise.all([
      this.augments.createIndexes(),
      this.itemsStats.createIndexes(),
      this.unitsStats.createIndexes(),
      this.comps.createIndexes(),
      this.compDetails.createIndexes(),
      this.lookups.createIndexes(),
      this.unitItemsProcessed.createIndexes(),
    ])
  }

  /**
   * 清空所有数据
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      this.augments.deleteAll(),
      this.itemsStats.deleteAll(),
      this.unitsStats.deleteAll(),
      this.comps.deleteAll(),
      this.compDetails.deleteAll(),
      this.lookups.deleteAll(),
      this.unitItemsProcessed.deleteAll(),
    ])
  }
}

/**
 * 创建 TFT 数据库实例
 */
export function createTFTDatabase(dbManager: MongoDBManager): TFTDatabase {
  return new TFTDatabase(dbManager)
}
