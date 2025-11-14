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
