import type { ChampionMeta } from 'types'

/**
 * 英雄数据库文档
 */
export interface ChampionDocument extends ChampionMeta {
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'champions'

/** 索引定义 */
export const INDEXES = [
  { key: { name: 1 }, unique: true },
  { key: { cost: 1 } },
  { key: { rank: 1 } },
  { key: { avgPlace: 1 } },
  { key: { updatedAt: -1 } },
]
