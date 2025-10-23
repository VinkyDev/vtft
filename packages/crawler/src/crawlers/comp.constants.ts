import { WAIT_EXTRA_LONG_MS, WAIT_MEDIUM_MS } from '../core/timing'

/**
 * 阵容爬虫常量配置
 */

export const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/comps' as const

export const MAX_COMPS_LIMIT = 1000 as const

export const MAX_CONSECUTIVE_FAILURES = 3 as const

export const SUCCESS_WAIT_MS = WAIT_MEDIUM_MS
export const FAILURE_WAIT_MS = WAIT_EXTRA_LONG_MS
