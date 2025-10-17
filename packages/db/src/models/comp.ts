import type { CompData } from 'types'

/**
 * 阵容基本信息文档（不含 details）
 */
export interface CompDocument extends Omit<CompData, 'details'> {
  /** 唯一标识符，用于关联 details */
  compId: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'comps'

/** 索引定义 */
export const INDEXES = [
  { key: { compId: 1 }, unique: true },
  { key: { name: 1 } },
  { key: { rank: 1 } },
  { key: { tier: 1 } },
  { key: { levelType: 1 } },
  { key: { avgPlace: 1 } },
  { key: { pickRate: -1 } },
  { key: { updatedAt: -1 } },
]
