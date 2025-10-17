import type { ItemMeta } from 'types'

/**
 * 装备数据库文档
 */
export interface ItemDocument extends ItemMeta {
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'items'

/** 索引定义 */
export const INDEXES = [
  { key: { name: 1 }, unique: true },
  { key: { rank: 1 } },
  { key: { avgPlace: 1 } },
  { key: { updatedAt: -1 } },
]
