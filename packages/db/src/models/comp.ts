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
