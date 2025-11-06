/**
 * CSS 选择器配置
 */

export const SELECTORS = {
  /** 强化符文相关选择器 */
  AUGMENT: {
    TABLE_ROW: 'table tbody tr',
    TABLE_CELL: 'td',
    IMAGE: 'img',
    LEVEL_CONTAINER: '.item-category-selector-item',
    OPGG_TAB_CONTAINER: 'div.flex.items-center.gap-2.px-4',
    OPGG_CONTAINER: 'div.flex.flex-col.md\\:min-h-\\[86px\\].md\\:flex-row',
  },

  /** 英雄相关选择器 */
  CHAMPION: {
    TABLE_ROW: 'table tbody tr',
  },

  /** 阵容相关选择器 */
  COMP: {
    ITEM: 'li:not(.flex)',
    IDENTIFIER: 'strong',
    EXPANDED_CONTENT: 'div.mt-1.flex.flex-col.gap-1',
    MORE_BUTTON: 'button:has-text("更多")',
  },

  /** 阵容详情 - 站位相关 */
  FORMATION: {
    AREA: '[class*="w-[326px]"]',
    ROW: '.flex.gap-1, .flex.gap-2',
    HERO_AVATAR: '[class*="clip-path:polygon"] img',
    HERO_STARS: '.absolute.-top-1.flex.w-full.items-center.justify-center',
    HERO_ITEMS: '.absolute.bottom-0',
  },

  /** 装备相关选择器 */
  ITEM: {
    TAB_CONTAINER: '.md\\:flex.md\\:gap-4',
    TABLE_ROW: 'table tbody tr',
  },
} as const

/** 强化符文级别筛选器 */
export const AUGMENT_LEVEL_SELECTORS = [
  { level: 'Silver' as const, selector: 'img[alt*="Silver"]' },
  { level: 'Gold' as const, selector: 'img[alt*="Gold"]' },
  { level: 'Prismatic' as const, selector: 'img[alt*="Prismatic"]' },
] as const

/** OP.GG 强化符文级别配置 */
export const OPGG_AUGMENT_LEVELS = [
  { level: 'Silver' as const, value: 'silver', label: '白银' },
  { level: 'Gold' as const, value: 'gold', label: '金币' },
  { level: 'Prismatic' as const, value: 'prism', label: '稜鏡' },
] as const

/** Tab 名称 */
export const TABS = {
  RECOMMENDED_AUGMENTS: '推荐强化符文',
  ENHANCEMENTS: '强化',
  ITEMS: '道具',
} as const
