import type { CompDetail } from 'types'

/**
 * 阵容详细信息文档
 */
export interface CompDetailDocument {
  /** 关联的阵容 ID */
  compId: string
  /** 队列（赛季） */
  queue: string
  /** 详细信息 */
  details: CompDetail
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'comp_details'
