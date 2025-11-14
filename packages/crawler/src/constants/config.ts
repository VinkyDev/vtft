/**
 * 爬虫配置常量
 */

/** 重试配置 */
export const RETRY = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 4000,
} as const

/** 数据质量阈值 */
export const DATA_QUALITY = {
  MIN_AUGMENT_COUNT: 5,
  MIN_AUGMENT_COUNT_OPGG: 30,
  MIN_CHAMPION_COUNT: 50,
  MIN_COMP_COUNT: 10,
} as const

/** 阵容相关配置 */
export const COMP = {
  MAX_LIMIT: 1000,
  MAX_CONSECUTIVE_FAILURES: 2,
  BOARD_ROWS: 4,
  BOARD_COLS: 7,
  DEFAULT_STAR_LEVEL: 2,
} as const

/** 表格列索引 */
export const TABLE_COLUMNS = {
  AUGMENT: 0,
  TIER: 1,
  TYPE: 2,
} as const

/** 装备分类配置 */
export const ITEM_CATEGORIES = [
  { value: 'all' as const, label: '全部' },
  { value: 'radiant' as const, label: '圣光' },
  { value: 'artifact' as const, label: '神器' },
  { value: 'core' as const, label: '核心' },
  { value: 'emblem' as const, label: '徽章' },
  { value: 'component' as const, label: '组件' },
] as const
