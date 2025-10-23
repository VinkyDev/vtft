/**
 * 强化符文爬虫常量配置
 */

// ============ URL 配置 ============

/** MetaTFT 强化符文页面 URL */
export const TARGET_URL = 'https://www.metatft.com/augments' as const

/** MetaTFT 首页 URL */
export const HOME_URL = 'https://www.metatft.com' as const

// ============ 强化符文级别配置 ============

/** 强化符文级别配置 */
export const AUGMENT_LEVELS = [
  { level: 'Silver' as const, selector: 'img[alt*="Silver"]' },
  { level: 'Gold' as const, selector: 'img[alt*="Gold"]' },
  { level: 'Prismatic' as const, selector: 'img[alt*="Prismatic"]' },
] as const

// ============ 选择器 ============

/** 表格行选择器 */
export const TABLE_ROW_SELECTOR = 'table tbody tr' as const

/** 级别筛选按钮容器 */
export const LEVEL_SELECTOR_CONTAINER = '.item-category-selector-item' as const

// ============ 数据质量配置 ============

/** OP.GG 数据最小数量阈值 */
export const OPGG_MIN_DATA_THRESHOLD = 30 as const

// ============ 重试配置 ============

/** 最大重试次数 */
export const MAX_RETRY_ATTEMPTS = 3 as const
