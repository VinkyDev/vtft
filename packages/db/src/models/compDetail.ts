import type { CompDetails } from 'types'

/**
 * 阵容详细信息文档
 */
export interface CompDetailDocument {
  /** 关联的阵容 ID */
  compId: string
  /** 详细信息 */
  details: CompDetails
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'comp_details'

/** 索引定义 */
export const INDEXES = [
  { key: { compId: 1 }, unique: true },
  { key: { updatedAt: -1 } },
]
