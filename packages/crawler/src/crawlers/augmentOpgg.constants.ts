import type { AugmentLevel } from 'types'

/** 目标URL */
export const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/augments'

/** 强化符文级别配置 - 新网站的级别映射 */
export const OPGG_AUGMENT_LEVELS: Array<{ level: AugmentLevel, value: string, label: string }> = [
  { level: 'Silver', value: 'silver', label: '白银' },
  { level: 'Gold', value: 'gold', label: '金币' },
  { level: 'Prismatic', value: 'prism', label: '稜鏡' },
]

/** 页面选择器 */
export const SELECTORS = {
  /** 标签容器选择器 */
  TAB_CONTAINER: 'div.flex.items-center.gap-2.px-4',
  /** 强化符文容器选择器 */
  AUGMENT_CONTAINER: 'div.flex.flex-col.md\\:min-h-\\[86px\\].md\\:flex-row',
} as const

/** 数据质量阈值 */
export const DATA_QUALITY = {
  /** 最小强化符文数量 */
  MIN_AUGMENT_COUNT: 5,
} as const
