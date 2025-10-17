import type { AugmentMeta } from 'types'

/**
 * 强化符文数据库文档
 */
export interface AugmentDocument extends AugmentMeta {
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'augments'

/** 索引定义 */
export const INDEXES = [
  { key: { name: 1 }, unique: true },
  { key: { level: 1 } },
  { key: { tier: 1 } },
  { key: { updatedAt: -1 } },
]
