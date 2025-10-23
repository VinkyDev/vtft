/**
 * 强化符文提取器常量配置
 */

// ============ 选择器 ============

/** 表格行选择器 */
export const TABLE_ROW_SELECTOR = 'table tbody tr' as const

/** 表格单元格选择器 */
export const TABLE_CELL_SELECTOR = 'td' as const

/** 强化符文图标选择器 */
export const AUGMENT_IMAGE_SELECTOR = 'img' as const

// ============ 表格列索引 ============

/** 强化符文名称和图标列索引 */
export const AUGMENT_COLUMN_INDEX = 0 as const

/** 段位列索引 */
export const TIER_COLUMN_INDEX = 1 as const

/** 类型列索引 */
export const TYPE_COLUMN_INDEX = 2 as const

/** 最小列数要求 */
export const MIN_COLUMN_COUNT = 3 as const

// ============ 超时配置 ============

/** 表格加载等待超时时间 (ms) */
export const TABLE_LOAD_TIMEOUT_MS = 30000 as const
