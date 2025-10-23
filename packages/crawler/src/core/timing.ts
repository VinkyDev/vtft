/**
 * 通用时间常量
 * 定义标准的等待时间级别
 */

/** 极短等待: 用于快速动画完成后 */
export const WAIT_INSTANT_MS = 100 as const

/** 短等待: 用于滚动、简单动画 */
export const WAIT_SHORT_MS = 300 as const

/** 中等待: 用于页面元素渲染、Tab切换 */
export const WAIT_MEDIUM_MS = 800 as const

/** 长等待: 用于复杂内容加载、Tab内容渲染 */
export const WAIT_LONG_MS = 1500 as const

/** 超长等待: 用于失败后恢复 */
export const WAIT_EXTRA_LONG_MS = 2000 as const

/** 页面重新加载等待 */
export const WAIT_PAGE_RELOAD_MS = 3000 as const

/**
 * 通用超时常量
 */

/** 快速操作超时: 点击、滚动 */
export const TIMEOUT_FAST_MS = 5000 as const

/** 标准操作超时: 元素查找、属性获取 */
export const TIMEOUT_STANDARD_MS = 10000 as const

/** 慢速操作超时: 网络请求、复杂渲染 */
export const TIMEOUT_SLOW_MS = 15000 as const

/** 页面加载超时 */
export const TIMEOUT_PAGE_LOAD_MS = 30000 as const
