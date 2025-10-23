/** OP.GG 等级图标映射 */
export const TIER_ICON_MAP: Record<string, string> = {
  'icon-tier-OP.png': 'OP',
  'icon-tier-S.png': 'S',
  'icon-tier-A.png': 'A',
  'icon-tier-B.png': 'B',
  'icon-tier-C.png': 'C',
} as const

/** 选择器配置 */
export const EXTRACTOR_SELECTORS = {
  /** 强化符文容器选择器 */
  AUGMENT_CONTAINER: 'div.flex.flex-col.md\\:min-h-\\[86px\\].md\\:flex-row',
  /** 强化符文项选择器 */
  AUGMENT_ITEM: 'div[class*="flex h-[64px] w-[60px] flex-col items-center gap-[4px]"]',
  /** 等级图标选择器 */
  TIER_ICON: 'img[src*="icon-tier-"]',
  /** 强化符文图标选择器 */
  AUGMENT_ICON: 'img',
  /** 强化符文名称选择器 */
  AUGMENT_NAME: 'span',
  /** 选中标签选择器 */
  SELECTED_TAB: 'div.hidden.md\\:flex div[class*="bronze-500"]',
} as const

/** 重试配置 */
export const EXTRACTOR_RETRY = {
  /** 最大重试次数 */
  MAX_RETRY_ATTEMPTS: 3,
} as const
