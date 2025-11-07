import type { BulkWriteResult, Collection, Filter, FindOptions } from 'mongodb'
import type { MongoDBManager } from '../client'

/**
 * BaseDocument 定义了所有文档的公共字段
 */
export interface BaseDocument {
  createdAt?: Date
  updatedAt?: Date
}

/**
 * UpsertConfig 定义批量更新的配置
 */
export interface UpsertConfig<TModel> {
  /** 用于确定文档唯一性的字段名 */
  uniqueField: keyof TModel
  /** 从模型数据生成 filter 的函数 */
  getFilterKey: (item: TModel) => string | number
}

/**
 * BaseRepository 提供通用的 CRUD 操作
 *
 * @template TDocument MongoDB 文档类型(包含 _id, createdAt, updatedAt)
 * @template TModel 业务模型类型(不含 MongoDB 内部字段)
 */
export abstract class BaseRepository<TDocument extends BaseDocument, TModel> {
  constructor(protected db: MongoDBManager) {}

  /**
   * 获取集合名称
   */
  protected abstract getCollectionName(): string

  /**
   * 创建索引
   */
  abstract createIndexes(): Promise<void>

  /**
   * 获取 MongoDB 集合实例
   */
  protected getCollection(): Collection<TDocument> {
    return this.db.getDb().collection<TDocument>(this.getCollectionName())
  }

  /**
   * 通用查询方法
   */
  async find(filter: Filter<TDocument> = {}, options?: FindOptions<TDocument>) {
    return await this.getCollection().find(filter, options).toArray()
  }

  /**
   * 通用计数方法
   */
  async count(filter: Filter<TDocument> = {}): Promise<number> {
    return await this.getCollection().countDocuments(filter)
  }

  /**
   * 根据名称查找
   */
  async findByName(name: string) {
    return await this.getCollection().findOne({ name } as unknown as Filter<TDocument>)
  }

  /**
   * 获取所有文档,按指定字段排序
   */
  async findAll(sortField: keyof TDocument = 'name' as keyof TDocument, sortOrder: 1 | -1 = 1) {
    return await this.getCollection()
      .find({})
      .sort({ [sortField]: sortOrder })
      .toArray()
  }

  /**
   * 删除所有数据
   */
  async deleteAll() {
    return await this.getCollection().deleteMany({})
  }

  /**
   * 批量插入或更新
   *
   * @param items 要插入或更新的数据数组
   * @param config 配置对象,指定唯一字段和 filter key 生成逻辑
   */
  async upsertMany(
    items: TModel[],
    config: UpsertConfig<TModel>,
  ): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection()
    const now = new Date()

    const operations = items.map((item) => {
      const filterValue = config.getFilterKey(item)
      const filter = { [config.uniqueField]: filterValue } as Filter<TDocument>

      return {
        updateOne: {
          filter,
          update: {
            $set: {
              ...(item as unknown as TDocument),
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            } as Partial<TDocument>,
          },
          upsert: true,
        },
      }
    })

    if (operations.length > 0) {
      return await collection.bulkWrite(operations)
    }
  }
}
