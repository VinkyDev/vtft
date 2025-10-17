/** 装备分类 */
export type ItemCategory = 'all' | 'radiant' | 'artifact' | 'core' | 'emblem' | 'component'

/** 装备元数据 */
export interface ItemMeta {
  /** 排名 */
  rank: number
  /** 装备名称 */
  name: string
  /** 装备图标 */
  icon: string
  /** 装备分类 */
  category: ItemCategory
  /** 合成配方（两个基础装备） */
  components?: string[]
  /** 平均名次 */
  avgPlace?: number
  /** 前四名率 (%) */
  top4Rate?: number
  /** 第一名率 (%) */
  firstPlaceRate?: number
  /** 比赛场次 */
  matches?: number
  /** 推荐给哪些英雄 */
  recommendedFor?: string[]
}
