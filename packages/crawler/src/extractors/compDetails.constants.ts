/**
 * 阵容详情提取器常量配置
 */

// ============ 选择器 ============

/** 阵容列表项 */
export const COMP_ITEM_SELECTOR = 'li:not(.flex)' as const

/** 阵容项包含的强文本标识 */
export const COMP_IDENTIFIER_SELECTOR = 'strong' as const

/** 展开后的内容容器 */
export const EXPANDED_CONTENT_SELECTOR = 'div.mt-1.flex.flex-col.gap-1' as const

/** 站位区域容器 */
export const FORMATION_AREA_SELECTORS = '[class*="w-[326px]"]' as const

/** 站位行容器 */
export const FORMATION_ROW_SELECTOR = '.flex.gap-1, .flex.gap-2' as const

/** 英雄头像容器 (六边形裁剪) */
export const HERO_AVATAR_SELECTOR = '[class*="clip-path:polygon"] img' as const

/** 英雄星级容器 */
export const HERO_STARS_SELECTOR = '.absolute.-top-1.flex.w-full.items-center.justify-center' as const

/** 英雄装备容器 */
export const HERO_ITEMS_SELECTOR = '.absolute.bottom-0' as const

/** 更多按钮 */
export const MORE_BUTTON_SELECTOR = 'button:has-text("更多")' as const

// ============ Tab 名称 ============

export const TAB_RECOMMENDED_AUGMENTS = '推荐强化符文' as const
export const TAB_ENHANCEMENTS = '强化' as const
export const TAB_ITEMS = '道具' as const

// ============ 布局常量 ============

export const BOARD_ROWS = 4 as const
export const BOARD_COLS = 7 as const

/** 默认英雄星级 */
export const DEFAULT_STAR_LEVEL = 2 as const

// ============ 重试配置 ============

export const RETRY_MAX_ATTEMPTS = 3 as const
