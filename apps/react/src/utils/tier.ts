/**
 * Tier 等级定义
 */
export type Tier = 'OP' | 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * Tier 排序权重（数字越小优先级越高）
 */
export const TIER_ORDER: Record<Tier, number> = {
  OP: 0,
  S: 1,
  A: 2,
  B: 3,
  C: 4,
  D: 5,
}

/**
 * Tier 文本颜色映射（Tailwind CSS类名）
 */
export const TIER_TEXT_COLORS: Record<Tier, string> = {
  OP: 'text-red-400',
  S: 'text-orange-400',
  A: 'text-yellow-400',
  B: 'text-green-400',
  C: 'text-blue-400',
  D: 'text-gray-400',
}

/**
 * Tier 背景渐变颜色映射（Tailwind CSS类名）
 */
export const TIER_BG_COLORS: Record<Tier, string> = {
  OP: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
  S: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
  A: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
  B: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
  C: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
  D: 'bg-gradient-to-br from-gray-400 to-gray-500 text-white',
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

/**
 * 获取 Tier 的排序权重
 *
 * @param tier - Tier 等级
 * @returns 排序权重（数字越小优先级越高）
 *
 * @example
 * ```ts
 * getTierOrder('S') // 1
 * getTierOrder('A') // 2
 * ```
 */
export function getTierOrder(tier: string): number {
  return TIER_ORDER[tier as Tier] ?? 999
}

/**
 * 比较两个 Tier 的优先级
 *
 * @param a - Tier A
 * @param b - Tier B
 * @returns 负数表示 a 优先级高，正数表示 b 优先级高，0 表示相同
 *
 * @example
 * ```ts
 * ['C', 'S', 'A'].sort(compareTier) // ['S', 'A', 'C']
 * ```
 */
export function compareTier(a: string, b: string): number {
  return getTierOrder(a) - getTierOrder(b)
}

/**
 * 按 Tier 分组数据
 *
 * @param items - 待分组的数组
 * @param getTier - 从数组项中提取 Tier 的函数
 * @returns 按 Tier 分组的对象
 *
 * @example
 * ```ts
 * const comps = [
 *   { name: 'Comp1', tier: 'S' },
 *   { name: 'Comp2', tier: 'A' },
 *   { name: 'Comp3', tier: 'S' },
 * ]
 * groupByTier(comps, item => item.tier)
 * // => { S: [...], A: [...] }
 * ```
 */
export function groupByTier<T>(
  items: T[],
  getTier: (item: T) => string,
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const tier = getTier(item) || 'D'
    if (!acc[tier]) {
      acc[tier] = []
    }
    acc[tier].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/**
 * 按 Tier 分组并排序数据
 *
 * @param items - 待分组的数组
 * @param getTier - 从数组项中提取 Tier 的函数
 * @param sortItems - 对每组内的项进行排序（可选）
 * @returns 按 Tier 排序的分组数组
 *
 * @example
 * ```ts
 * const augments = [
 *   { name: 'Aug1', tier: 'A' },
 *   { name: 'Aug2', tier: 'S' },
 * ]
 * groupAndSortByTier(
 *   augments,
 *   item => item.tier,
 *   (a, b) => a.name.localeCompare(b.name)
 * )
 * // => [{ tier: 'S', items: [...] }, { tier: 'A', items: [...] }]
 * ```
 */
export function groupAndSortByTier<T>(
  items: T[],
  getTier: (item: T) => string,
  sortItems?: (a: T, b: T) => number,
): Array<{ tier: string, items: T[] }> {
  const grouped = groupByTier(items, getTier)

  return Object.entries(grouped)
    .sort(([a], [b]) => compareTier(a, b))
    .map(([tier, items]) => ({
      tier,
      items: sortItems ? items.sort(sortItems) : items,
    }))
}
