/**
 * TFT（云顶之弈）游戏数据类型定义
 * 这些类型被 crawler、db、api 和前端共享使用
 */

/** 爬虫配置选项 */
export interface CrawlOptions {
  /** 是否使用无头模式 */
  headless?: boolean
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否保存截图 */
  screenshot?: boolean
}

/** 基础装备信息 */
export interface Item {
  name: string
  icon: string
}

/** 英雄信息 */
export interface Champion {
  /** 英雄名称 */
  name: string
  /** 星级 (1-3) */
  stars: number
  /** 优先级 (1st, 2nd, 3rd 等) */
  priority?: string
  /** 装备列表 */
  items?: Item[]
  /** 费用 (1-5) */
  cost: number
  /** 图标 URL */
  icon: string
}

/** 英雄元数据（统计信息） */
export interface ChampionMeta {
  /** 排名 */
  rank: number
  /** 英雄名称 */
  name: string
  /** 英雄图标 URL */
  icon: string
  /** 羁绊列表 */
  traits?: Trait[]
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

/** 羁绊信息 */
export interface Trait {
  /** 羁绊名称 */
  name: string
  /** 图标 URL */
  icon: string
  /** 羁绊等级/层级 */
  level?: number
  /** 羁绊数量 */
  count?: number
}

/** 强化符文级别 */
export type AugmentLevel = 'Silver' | 'Gold' | 'Prismatic'

/** 强化符文信息 */
export interface Augment {
  /** 符文名称 */
  name: string
  /** 图标 URL */
  icon: string
  /** 描述 */
  description?: string
  /** 等级 (银色/金色/棱彩) */
  tier?: string
}

/** 强化符文元数据 */
export interface AugmentMeta {
  /** 强化符文名称 */
  name: string
  /** 强化符文图标 URL */
  icon: string
  /** 级别（银色/金色/棱彩） */
  level: AugmentLevel
  /** 段位（OP/S/A/B/C/D等） */
  tier?: string
  /** 类型（经济/战斗等） */
  type?: string
}

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

/** 推荐道具信息 */
export interface RecommendedItem {
  /** 道具名称 */
  name: string
  /** 图标 URL */
  icon: string
  /** 推荐给哪些英雄 */
  recommendedFor?: string[]
  /** 平均排名 */
  avgRank?: number
  /** 前四率 (%) */
  top4Rate?: number
  /** 第一名率 (%) */
  firstPlaceRate?: number
  /** 优先级 */
  priority?: number
}

/** 强化信息 */
export interface Enhancement {
  /** 强化名称 */
  name: string
  /** 段位/评级 (S, A, B, C, D) */
  tier?: string
  /** 权重 */
  weight?: number
  /** 标签 (Common, Weird, Trait, Multiple 等) */
  tags?: string[]
}

/** 英雄强化推荐 */
export interface ChampionEnhancement {
  /** 英雄名称 */
  championName: string
  /** 英雄图标 */
  championIcon?: string
  /** 推荐的强化列表 */
  enhancements: Enhancement[]
}

/** 站位上的英雄信息 */
export interface PositionChampion {
  /** 英雄名称 */
  name: string
  /** 英雄图标 */
  icon: string
  /** 星级 (1-5) */
  stars: number
  /** 装备列表 */
  items: Item[]
}

/** 战场位置信息 */
export interface Position {
  /** 行索引 (0-3) */
  row: number
  /** 列索引 (0-6) */
  col: number
  /** 该位置上的英雄，null 表示空位 */
  champion: PositionChampion | null
}

/** 站位信息（4行7列的战场布局） */
export interface Formation {
  /** 所有位置的信息 */
  positions: Position[]
}

/** 阵容详细信息 */
export interface CompDetails {
  /** 推荐强化符文列表 */
  augments: Augment[]
  /** 推荐道具列表 */
  items: RecommendedItem[]
  /** 英雄强化推荐列表 (每个核心英雄对应一个强化列表) */
  championEnhancements: ChampionEnhancement[]
  /** 站位信息 */
  formation?: Formation
}

/** 阵容数据 */
export interface CompData {
  /** 阵容ID */
  compId: string
  /** 排名 */
  rank: number
  /** 阵容名称 */
  name: string
  /** 评级 (S, A, B, C, D) */
  tier?: string
  /** 等级 (如 5, 8) */
  level?: number
  /** 等级类型 (reroll 或 standard) */
  levelType?: string
  /** 难度 (Easy, Hard, Medium) */
  difficulty?: string
  /** 流行度 (Popular, Trending) */
  popularity?: string
  /** 平均名次 */
  avgPlace?: number
  /** 第一名率 (%) */
  firstPlaceRate?: number
  /** 前四名率 (%) */
  top4Rate?: number
  /** 挑选率 (%) */
  pickRate?: number
  /** 羁绊列表 */
  traits: Trait[]
  /** 英雄列表 */
  champions: Champion[]
  /** 详细信息 (点击展开后获取) */
  details?: CompDetails
}
