/**
 * 装备、英雄综合评分算法
 * 首先, 把原始效果用贝叶斯收缩拉向全局先验，再把收缩后的效用映射为 0–100 的质量分；
 * 然后用自适应 ECDF（相对热度）× 样本比 得到置信度；
 * 最后把质量分乘以置信度并加上基于 ECDF 的流行度加成。
 */

import { DEFAULT_AVG_PLACE, RANKING_CONFIG } from './constants'

// 解构常量以保持代码简洁
const {
  POPULARITY_CAP,
  CONFIDENCE_ECDF_POWER,
  CONFIDENCE_COUNT_POWER,
  SHRINKAGE_STRENGTH,
  SAMPLE_RATIO_STRENGTH,
  MANDATORY_BLEND_STRENGTH,
  NECESSITY_THRESHOLD,
  NECESSITY_POWER,
} = RANKING_CONFIG

// ====================================================
interface GlobalStats {
  mu0: number
  medianPickRate: number
  p75PickRate: number
  p90PickRate: number
  ecdf: (r: number) => number
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
    return sorted[lower] ?? 0
  return (sorted[lower] ?? 0) * (1 - weight) + (sorted[upper] ?? 0) * weight
}

function buildECDF(values: number[]): (x: number) => number {
  const sorted = values.slice().sort((a, b) => a - b)
  const total = sorted.length

  return (x: number) => {
    let l = 0
    let r = sorted.length

    while (l < r) {
      const m = Math.floor((l + r) / 2)
      const mv = sorted[m] ?? 0
      if (mv <= x)
        l = m + 1
      else r = m
    }

    return total === 0 ? 0 : l / total
  }
}

/**
 * 计算全局统计量
 * @param items 所有装备/英雄数据
 * @returns 全局统计量
 */
function calculateGlobalStats(
  items: Array<{ pickRate?: number, avgPlace?: number, avgRank?: number }>,
): GlobalStats {
  // 过滤掉没有必要数据的项
  const validItems = items.filter(
    item => (item.pickRate !== undefined && item.pickRate > 0)
      && (item.avgPlace !== undefined || item.avgRank !== undefined),
  )

  if (validItems.length === 0) {
    return {
      mu0: 0,
      medianPickRate: 50,
      p75PickRate: 75,
      p90PickRate: 90,
      ecdf: () => 0.5,
    }
  }

  // 1. 计算全局先验均值
  const impacts = validItems.map((item) => {
    const avgRank = item.avgRank ?? item.avgPlace ?? DEFAULT_AVG_PLACE
    return -(avgRank - DEFAULT_AVG_PLACE) // u_raw = -impact
  })
  const mu0 = impacts.reduce((sum, val) => sum + val, 0) / impacts.length

  // 2. 提取所有 pickRate 并排序
  const allPickRates = validItems
    .map(item => item.pickRate!)
    .sort((a, b) => a - b)

  // 3. 计算分位数
  const medianPickRate = percentile(allPickRates, 50)
  const p75PickRate = percentile(allPickRates, 75)
  const p90PickRate = percentile(allPickRates, 90)

  // 4. 构建ECDF函数 (优化版)
  const ecdf = buildECDF(allPickRates)

  return { mu0, medianPickRate, p75PickRate, p90PickRate, ecdf }
}

/**
 * 计算综合得分
 * @param pickRate 装备/英雄的 pickRate
 * @param avgRank 平均排名 (或 avgPlace)
 * @param globalStats 全局统计量
 * @returns 综合得分 (0-100+)
 */
function calculateCompositeScore(
  pickRate: number,
  avgRank: number,
  globalStats: GlobalStats,
): number {
  const r = pickRate
  const { mu0, medianPickRate, ecdf } = globalStats

  // 1. 基础效用转换
  const impact = avgRank - DEFAULT_AVG_PLACE
  const uRaw = -impact

  // 2. 贝叶斯收缩 (k = medianMatches × SHRINKAGE_STRENGTH)
  const k = Math.max(1, medianPickRate * SHRINKAGE_STRENGTH)
  const uShrink = (k * mu0 + r * uRaw) / (k + r)

  const confEcdf = ecdf(r)
  const kConf = Math.max(1, medianPickRate * SAMPLE_RATIO_STRENGTH / 2)
  const confCount = r / (r + kConf)
  const adjustedEcdf = confEcdf ** CONFIDENCE_ECDF_POWER
  const adjustedCount = confCount ** CONFIDENCE_COUNT_POWER
  const confidence = adjustedEcdf * adjustedCount

  const necessityRaw = Math.max(0, (confEcdf - NECESSITY_THRESHOLD) / (1 - NECESSITY_THRESHOLD))
  const necessity = necessityRaw ** NECESSITY_POWER
  const necessityWeight = necessity * adjustedCount
  const uAdjusted = (1 - necessityWeight * MANDATORY_BLEND_STRENGTH) * uShrink + necessityWeight * MANDATORY_BLEND_STRENGTH * mu0

  const qualityScore = Math.max(0, Math.min(100, 50 + uAdjusted * 25))
  const popBonus = POPULARITY_CAP * confEcdf
  const composite = qualityScore * confidence + popBonus

  return composite
}

/**
 * 为数据项批量计算综合得分
 * @param items 数据项数组
 * @returns 带有综合得分的数据项数组
 */
export function rankItems<T extends { pickRate: number, impact: number }>(
  items: T[],
): (T & { compositeScore: number })[] {
  // 计算全局统计量
  const globalStats = calculateGlobalStats(
    items.map(item => ({
      pickRate: item.pickRate,
      avgRank: item.impact + DEFAULT_AVG_PLACE,
    })),
  )

  // 为每个项计算综合得分
  return items.map((item) => {
    const avgRank = item.impact + DEFAULT_AVG_PLACE
    const compositeScore = calculateCompositeScore(
      item.pickRate,
      avgRank,
      globalStats,
    )

    return { ...item, compositeScore }
  })
}
