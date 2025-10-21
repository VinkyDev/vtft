/**
 * 装备、英雄综合评分算法
 * 首先, 把原始效果用贝叶斯收缩拉向全局先验，再把收缩后的效用映射为 0–100 的质量分；
 * 然后用自适应 ECDF（相对热度）× 样本比 得到置信度；
 * 最后把质量分乘以置信度并加上基于 ECDF 的流行度加成。
 */

// ==================== 可调优常量 ====================

/**
 * 流行度加成上限
 * - 控制高场次装备的额外加分上限
 * - 值越大: 必备装备(高场次但影响一般)的排名越高
 * - 值越小: 更倾向于高质量装备
 * - 建议范围: 3-8
 * - 推荐值: 5 (平衡质量和流行度)
 */
export const POPULARITY_CAP = 5

/**
 * 基础置信度的幂次调整
 * - confidence = (confEcdf^CONFIDENCE_ECDF_POWER) × (confCount^CONFIDENCE_COUNT_POWER)
 * - ECDF幂次越小: 对场次分布的敏感度越低,质量差异更明显
 * - Count幂次越小: 对绝对场次的敏感度越低,质量差异更明显
 * - 建议范围: 0.1-1.0
 * - 推荐值: 0.3-0.5
 */
export const CONFIDENCE_ECDF_POWER = 0.3
export const CONFIDENCE_COUNT_POWER = 0.5

/**
 * 贝叶斯收缩的强度系数
 * - k = medianMatches × SHRINKAGE_STRENGTH
 * - 值越大: 对小样本的收缩越强,越保守
 * - 值越小: 对小样本的收缩越弱,越激进
 * - 建议范围: 0.5-2.0
 * - 推荐值: 1.0 (直接使用中位数)
 */
export const SHRINKAGE_STRENGTH = 1.0

/**
 * 样本比调整的强度系数
 * - kConf = medianMatches × SAMPLE_RATIO_STRENGTH / 2
 * - 值越大: 对中低场次的惩罚越轻
 * - 值越小: 对中低场次的惩罚越重
 * - 建议范围: 0.5-2.0
 * - 推荐值: 1.0
 */
export const SAMPLE_RATIO_STRENGTH = 1.0

// ====================================================

/**
 * 排序算法参数
 */
export interface RankingParams {
  /** 流行度加成上限,默认 15 */
  popularityCap: number
}

/**
 * 全局统计量
 */
export interface GlobalStats {
  /** 全局先验均值 mean(-impact) */
  mu0: number
  /** 场次中位数 */
  medianMatches: number
  /** 场次75分位数 */
  p75Matches: number
  /** 场次90分位数 */
  p90Matches: number
  /** 场次的ECDF函数 (经验累积分布函数) */
  ecdf: (n: number) => number
}

/**
 * 带有评分的数据项
 */
export interface RankedItem {
  /** 场次数 */
  matches: number
  /** 影响值 (avgRank - 4.5) */
  impact: number
  /** 综合得分 */
  compositeScore?: number
}

/**
 * 计算分位数
 * @param sorted 已排序的数组
 * @param p 分位数百分比 (0-100)
 * @returns 分位数值
 */
function percentile(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index - lower

  if (lower === upper)
    return sorted[lower]
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

/**
 * 构建优化的ECDF函数 (使用二分查找，对数尺度)
 * @param matches 所有场次数组
 * @returns ECDF函数
 */
function buildECDF(matches: number[]): (n: number) => number {
  // 对场次取对数，缓解长尾分布
  const logMatches = matches.map(m => Math.log10(m + 1)).sort((a, b) => a - b)
  const totalCount = logMatches.length

  return (n: number) => {
    const logN = Math.log10(n + 1)

    // 二分查找
    let left = 0
    let right = logMatches.length

    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (logMatches[mid] <= logN) {
        left = mid + 1
      }
      else {
        right = mid
      }
    }

    return left / totalCount
  }
}

/**
 * 计算全局统计量
 * @param items 所有装备/英雄数据
 * @returns 全局统计量
 */
export function calculateGlobalStats(
  items: Array<{ matches?: number, avgPlace?: number, avgRank?: number }>,
): GlobalStats {
  // 过滤掉没有必要数据的项
  const validItems = items.filter(
    item => (item.matches !== undefined && item.matches > 0)
      && (item.avgPlace !== undefined || item.avgRank !== undefined),
  )

  if (validItems.length === 0) {
    return {
      mu0: 0,
      medianMatches: 100,
      p75Matches: 200,
      p90Matches: 500,
      ecdf: () => 0.5,
    }
  }

  // 1. 计算全局先验均值
  const impacts = validItems.map((item) => {
    const avgRank = item.avgRank ?? item.avgPlace ?? 4.5
    return -(avgRank - 4.5) // u_raw = -impact
  })
  const mu0 = impacts.reduce((sum, val) => sum + val, 0) / impacts.length

  // 2. 提取所有场次并排序
  const allMatches = validItems
    .map(item => item.matches!)
    .sort((a, b) => a - b)

  // 3. 计算分位数
  const medianMatches = percentile(allMatches, 50)
  const p75Matches = percentile(allMatches, 75)
  const p90Matches = percentile(allMatches, 90)

  // 4. 构建ECDF函数 (优化版)
  const ecdf = buildECDF(allMatches)

  return { mu0, medianMatches, p75Matches, p90Matches, ecdf }
}

/**
 * 计算综合得分
 * @param matches 场次数
 * @param avgRank 平均排名 (或 avgPlace)
 * @param globalStats 全局统计量
 * @returns 综合得分 (0-100+)
 */
export function calculateCompositeScore(
  matches: number,
  avgRank: number,
  globalStats: GlobalStats,

): number {
  const n = matches
  const { mu0, medianMatches, ecdf } = globalStats

  // 1. 基础效用转换
  const impact = avgRank - 4.5
  const uRaw = -impact

  // 2. 贝叶斯收缩 (k = medianMatches × SHRINKAGE_STRENGTH)
  const k = Math.max(1, medianMatches * SHRINKAGE_STRENGTH)
  const uShrink = (k * mu0 + n * uRaw) / (k + n)

  // 3. 质量得分 (0-100)
  const qualityScore = Math.max(0, Math.min(100, 50 + uShrink * 25))

  // 4. 置信度系数 (分别对ECDF和样本比使用幂次调整)
  const confEcdf = ecdf(n)
  const kConf = Math.max(1, medianMatches * SAMPLE_RATIO_STRENGTH / 2)
  const confCount = n / (n + kConf)

  // 分别调整ECDF和Count的权重
  const adjustedEcdf = confEcdf ** CONFIDENCE_ECDF_POWER
  const adjustedCount = confCount ** CONFIDENCE_COUNT_POWER
  const confidence = adjustedEcdf * adjustedCount

  // 5. 流行度加成 (ECDF × cap)
  const popBonus = POPULARITY_CAP * confEcdf

  // 6. 综合得分
  const composite = qualityScore * confidence + popBonus

  return composite
}

/**
 * 为数据项批量计算综合得分
 * @param items 数据项数组
 * @returns 带有综合得分的数据项数组
 */
export function rankItems<T extends { matches: number, impact: number }>(
  items: T[],
): (T & { compositeScore: number })[] {
  // 计算全局统计量
  const globalStats = calculateGlobalStats(
    items.map(item => ({
      matches: item.matches,
      avgRank: item.impact + 4.5,
    })),
  )

  // 为每个项计算综合得分
  return items.map((item) => {
    const avgRank = item.impact + 4.5
    const compositeScore = calculateCompositeScore(
      item.matches,
      avgRank,
      globalStats,
    )

    return { ...item, compositeScore }
  })
}
