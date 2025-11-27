/**
 * Tier 等级定义
 */
type Tier = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * Tier 文本颜色映射（Tailwind CSS类名）
 */
const TIER_TEXT_COLORS: Record<Tier, string> = {
  S: 'text-orange-400',
  A: 'text-yellow-400',
  B: 'text-green-400',
  C: 'text-blue-400',
  D: 'text-gray-400',
}

/**
 * Tier 背景渐变颜色映射（Tailwind CSS类名）
 */
const TIER_BG_COLORS: Record<Tier, string> = {
  S: 'bg-linear-to-br from-orange-500 to-orange-600 text-white',
  A: 'bg-linear-to-br from-yellow-500 to-yellow-600 text-white',
  B: 'bg-linear-to-br from-green-500 to-green-600 text-white',
  C: 'bg-linear-to-br from-blue-500 to-blue-600 text-white',
  D: 'bg-linear-to-br from-gray-400 to-gray-500 text-white',
}

/**
 * 获取 Tier 的文本颜色类名
 *
 * @param tier - Tier 等级
 * @returns Tailwind CSS 颜色类名
 *
 * @example
 * ```tsx
 * <span className={getTierTextColor('S')}>S级</span>
 * ```
 */
export function getTierTextColor(tier: string): string {
  return TIER_TEXT_COLORS[tier as Tier] || TIER_TEXT_COLORS.D
}

/**
 * 获取 Tier 的背景颜色类名
 *
 * @param tier - Tier 等级
 * @returns Tailwind CSS 颜色类名
 *
 * @example
 * ```tsx
 * <div className={getTierBgColor('S')}>S</div>
 * ```
 */
export function getTierBgColor(tier: string): string {
  return TIER_BG_COLORS[tier as Tier] || TIER_BG_COLORS.D
}
