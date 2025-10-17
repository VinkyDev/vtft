/**
 * 英雄元数据（从全局统计页面爬取）
 */
export interface ChampionMeta {
  /** 排名 */
  rank: number
  /** 英雄名称 */
  name: string
  /** 英雄图标 URL */
  icon: string
  /** 羁绊列表 */
  traits?: string[]
  /** 费用（1-5） */
  cost?: number
  /** 平均排名 */
  avgPlace?: number
  /** 前四名率（百分比） */
  top4Rate?: number
  /** 第一名率（百分比） */
  firstPlaceRate?: number
  /** 比赛数量 */
  matches?: number
}
