import type { Comp } from 'types'
import {
  DEFAULT_AVG_PLACE,
  LOW_PICK_RATE_THRESHOLD,
  METRIC_WEIGHTS,
  NORMALIZATION_CONFIG,
  TIER_PERCENTILES,
} from './constants'

/**
 * 阵容评级类型
 */
type CompTier = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * 阵容类型
 */
type CompCategory = 'normal' | 'low_pickrate'

/**
 * 增强的阵容数据
 */
export interface EnhancedCompData extends Comp {
  /** 计算后的评级 */
  calculatedTier: CompTier
  /** 阵容类型（普通/低出场率） */
  category: CompCategory
  /** 综合得分 */
  score: number
}

/**
 * 分组后的阵容数据
 */
export interface GroupedComps {
  tier: CompTier
  normal: EnhancedCompData[]
  lowPickrate: EnhancedCompData[]
}

/**
 * 通用归一化函数
 * 将任意范围的值映射到 0-100 区间
 *
 * @param value 原始值
 * @param min 最小值
 * @param max 最大值
 * @param reverse 是否反向（true: 值越小分数越高，如平均排名）
 * @returns 归一化后的分数 (0-100)
 */
function normalize(value: number, min: number, max: number, reverse = false): number {
  const clampedValue = Math.max(min, Math.min(max, value))
  const normalized = (clampedValue - min) / (max - min)
  const score = reverse ? (1 - normalized) : normalized
  return score * 100
}

/**
 * 指数变换函数
 * 用于强调极端值，适合需要放大差异的指标
 *
 * @param normalizedScore 归一化分数 (0-100)
 * @param exponent 指数因子 (> 1: 强调高分，< 1: 压缩差异)
 * @returns 变换后的分数 (0-100)
 */
function exponentialTransform(normalizedScore: number, exponent = 2): number {
  const ratio = normalizedScore / 100
  return (ratio ** exponent) * 100
}

/**
 * 对数变换函数
 * 用于压缩差异，适合范围跨度大的指标
 *
 * @param normalizedScore 归一化分数 (0-100)
 * @returns 变换后的分数 (0-100)
 */
function logarithmicTransform(normalizedScore: number): number {
  const ratio = normalizedScore / 100
  // 使用 log(1 + x) 保证平滑过渡
  return (Math.log(1 + ratio) / Math.log(2)) * 100
}

/**
 * S 型曲线变换（Sigmoid）
 * 用于平滑过渡，适合需要在中间值附近快速变化的指标
 *
 * @param normalizedScore 归一化分数 (0-100)
 * @param steepness 陡峭度 (默认 10)
 * @returns 变换后的分数 (0-100)
 */
function sigmoidTransform(normalizedScore: number, steepness = 10): number {
  const x = (normalizedScore - 50) / 50 // 映射到 [-1, 1]
  const sigmoid = 1 / (1 + Math.exp(-steepness * x))
  return sigmoid * 100
}

/**
 * 计算阵容综合得分
 * @param comp 阵容数据
 * @returns 综合得分（0-100）
 */
function calculateCompScore(comp: Comp): number {
  // ========== 1. 平均排名得分（权重 40%）==========
  const avgPlace = comp.avg || DEFAULT_AVG_PLACE
  const avgPlaceNormalized = normalize(
    avgPlace,
    NORMALIZATION_CONFIG.avgPlace.min,
    NORMALIZATION_CONFIG.avgPlace.max,
    true, // 反向：排名越小分数越高
  )
  const avgPlaceScore = exponentialTransform(avgPlaceNormalized, 2)

  // ========== 2. 前四率得分（权重 20%）==========
  const top4Rate = comp.top4Rate || 0
  const top4Score = normalize(
    top4Rate,
    NORMALIZATION_CONFIG.top4Rate.min,
    NORMALIZATION_CONFIG.top4Rate.max,
  )

  // ========== 3. 吃鸡率得分（权重 10%）==========
  const firstPlaceRate = comp.firstRate || 0
  const firstPlaceNormalized = normalize(
    firstPlaceRate,
    NORMALIZATION_CONFIG.firstPlaceRate.min,
    NORMALIZATION_CONFIG.firstPlaceRate.max,
  )
  const firstPlaceScore = sigmoidTransform(firstPlaceNormalized, 8)

  // ========== 4. 选取率得分（权重 30%）==========
  const pickRate = comp.pickRate || NORMALIZATION_CONFIG.pickRate.min
  const pickRateNormalized = normalize(
    pickRate,
    NORMALIZATION_CONFIG.pickRate.min,
    NORMALIZATION_CONFIG.pickRate.max,
  )
  const pickRateScore = logarithmicTransform(pickRateNormalized)

  // ========== 加权计算综合得分 ==========
  const totalScore
    = avgPlaceScore * METRIC_WEIGHTS.avgPlace
      + top4Score * METRIC_WEIGHTS.top4Rate
      + firstPlaceScore * METRIC_WEIGHTS.firstPlaceRate
      + pickRateScore * METRIC_WEIGHTS.pickRate

  return Math.max(0, Math.min(100, totalScore))
}

/**
 * 根据得分和百分位计算评级
 * 使用百分位数确保评级分布合理
 *
 * @param _score 综合得分（仅用于排序，不直接用于评级判定）
 * @param percentile 当前阵容的百分位（0-1）
 * @returns 评级
 */
function getCompTier(_score: number, percentile: number): CompTier {
  // 基于百分位分配评级
  if (percentile <= TIER_PERCENTILES.S)
    return 'S'
  if (percentile <= TIER_PERCENTILES.A)
    return 'A'
  if (percentile <= TIER_PERCENTILES.B)
    return 'B'
  if (percentile <= TIER_PERCENTILES.C)
    return 'C'
  return 'D'
}

/**
 * 判断阵容是否为低出场率阵容
 *
 * @param comp 阵容数据
 * @returns 是否为低出场率阵容
 */
function isLowPickrateComp(comp: Comp): boolean {
  const pickRate = comp.pickRate || 0
  return pickRate < LOW_PICK_RATE_THRESHOLD
}

/**
 * 增强阵容数据（计算评级和分类）
 * 新算法：
 * 1. 识别低出场率阵容（选取率 < 0.25% 且平均排名 < 4.5）
 * 2. 对普通阵容进行评分和 SABCD 评级（使用百分位）
 * 3. 对低出场率阵容单独评分和 SABCD 评级（使用百分位）
 * 4. 合并两组阵容
 *
 * @param comps 原始阵容数据
 * @returns 增强后的阵容数据
 */
function enhanceComps(comps: Comp[]): EnhancedCompData[] {
  // 1. 分离低出场率阵容和普通阵容
  const lowPickrateComps: Comp[] = []
  const normalComps: Comp[] = []

  comps.forEach((comp) => {
    if (isLowPickrateComp(comp)) {
      lowPickrateComps.push(comp)
    }
    else {
      normalComps.push(comp)
    }
  })

  // 2. 对普通阵容进行评分、排序和评级
  const normalCompsWithScores = normalComps.map((comp) => {
    const score = calculateCompScore(comp)
    return { comp, score }
  })

  // 按得分降序排序
  normalCompsWithScores.sort((a, b) => b.score - a.score)

  // 计算百分位并分配评级
  const normalTotal = normalCompsWithScores.length
  const enhancedNormalComps: EnhancedCompData[] = normalCompsWithScores.map((item, index) => {
    const percentile = (index + 1) / normalTotal
    const calculatedTier = getCompTier(item.score, percentile)

    return {
      ...item.comp,
      calculatedTier,
      category: 'normal',
      score: item.score,
    }
  })

  // 3. 对低出场率阵容进行评分、排序和评级
  const lowPickrateCompsWithScores = lowPickrateComps.map((comp) => {
    const score = calculateCompScore(comp)
    return { comp, score }
  })

  // 按得分降序排序
  lowPickrateCompsWithScores.sort((a, b) => b.score - a.score)

  // 计算百分位并分配评级
  const lowPickrateTotal = lowPickrateCompsWithScores.length
  const enhancedLowPickrateComps: EnhancedCompData[] = lowPickrateCompsWithScores.map((item, index) => {
    const percentile = (index + 1) / lowPickrateTotal
    const calculatedTier = getCompTier(item.score, percentile)

    return {
      ...item.comp,
      calculatedTier,
      category: 'low_pickrate',
      score: item.score,
    }
  })

  // 4. 合并所有阵容
  return [...enhancedNormalComps, ...enhancedLowPickrateComps]
}

type CompSortField = 'composite' | 'rank' | 'matches'

/**
 * 按评级分组阵容
 *
 * @param comps 增强后的阵容数据
 * @param sortField 排序字段
 * @returns 分组后的阵容数据
 */
function groupCompsByTier(comps: EnhancedCompData[], sortField: CompSortField = 'composite'): GroupedComps[] {
  const getSortFn = (field: CompSortField) => {
    switch (field) {
      case 'rank':
        return (a: EnhancedCompData, b: EnhancedCompData) =>
          (a.avg ?? DEFAULT_AVG_PLACE) - (b.avg ?? DEFAULT_AVG_PLACE)
      case 'matches':
        return (a: EnhancedCompData, b: EnhancedCompData) =>
          (b.pickRate ?? 0) - (a.pickRate ?? 0)
      default:
        return (a: EnhancedCompData, b: EnhancedCompData) => b.score - a.score
    }
  }

  const sortFn = getSortFn(sortField)

  // ========== 特殊处理：按排名排序时，所有阵容一起排序 ==========
  if (sortField === 'rank') {
    // 全局排序
    const sorted = [...comps].sort(sortFn)

    const normal: EnhancedCompData[] = []
    const lowPickrate: EnhancedCompData[] = []

    sorted.forEach((comp) => {
      if (comp.category === 'low_pickrate') {
        lowPickrate.push(comp)
      }
      else {
        normal.push(comp)
      }
    })

    const group: GroupedComps = {
      tier: 'S', // 这里只是占位，前端实际按卡片上的 tier 徽章展示
      normal,
      lowPickrate,
    }

    return group.normal.length > 0 || group.lowPickrate.length > 0 ? [group] : []
  }

  // ========== 默认行为：先按 tier 分组，再在组内排序 ==========
  const groups: Record<CompTier, GroupedComps> = {
    S: { tier: 'S', normal: [], lowPickrate: [] },
    A: { tier: 'A', normal: [], lowPickrate: [] },
    B: { tier: 'B', normal: [], lowPickrate: [] },
    C: { tier: 'C', normal: [], lowPickrate: [] },
    D: { tier: 'D', normal: [], lowPickrate: [] },
  }

  // 分组
  comps.forEach((comp) => {
    const group = groups[comp.calculatedTier]
    if (comp.category === 'low_pickrate') {
      group.lowPickrate.push(comp)
    }
    else {
      group.normal.push(comp)
    }
  })

  Object.values(groups).forEach((group) => {
    group.normal.sort(sortFn)
    group.lowPickrate.sort(sortFn)
  })

  // 返回有数据的分组，按 S -> A -> B -> C -> D 顺序
  return (['S', 'A', 'B', 'C', 'D'] as CompTier[])
    .map(tier => groups[tier])
    .filter(group => group.normal.length > 0 || group.lowPickrate.length > 0)
}

/**
 * 处理阵容数据（增强 + 分组）
 *
 * @param comps 原始阵容数据
 * @param sortField 排序字段
 * @returns 分组后的阵容数据
 */
export function processComps(comps: Comp[], sortField: CompSortField = 'composite'): GroupedComps[] {
  const enhanced = enhanceComps(comps)
  return groupCompsByTier(enhanced, sortField)
}
