import type { Comp } from 'types'

/**
 * 阵容基本信息文档（不含 details），来源于 tftv2 Comp
 */
export interface CompDocument extends Comp {
  /** 唯一标识符，用于关联 details */
  compId: string
  /** 队列（赛季） */
  queue: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

/** 集合名称 */
export const COLLECTION_NAME = 'comps'
