import type { CompData } from 'types'

/**
 * 阵容评级类型
 */
export type CompTier = 'S' | 'A' | 'B' | 'C' | 'D'

/**
 * 阵容类型
 */
export type CompCategory = 'normal' | 'low_pickrate'

/**
 * 增强的阵容数据
 */
export interface EnhancedCompData extends CompData {
  /** 计算后的评级 */
  calculatedTier: CompTier
  /** 阵容类型（普通/专属） */
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
 * 评级百分位阈值
 * 基于排名百分位来分配评级，确保每个评级都有合理的阵容分布
 */
const TIER_PERCENTILES = {
  S: 0.10, // 前 10%
  A: 0.30, // 前 10%-30%
  B: 0.55, // 前 30%-55%
  C: 0.80, // 前 55%-80%
  D: 1.00, // 后 20%
}

/**
 * 计算阵容综合得分
 * 使用统计学方法优化计算，确保专属阵容也能获得合理评级
 *
 * 核心思路：
 * 1. 平均排名使用指数转换，强调极端值（非常好的阵容）
 * 2. 选取率使用对数转换，降低选取率的影响
 * 3. 前四率和吃鸡率直接使用，反映真实表现
 *
 * @param comp 阵容数据
 * @returns 综合得分（0-100）
 */
function calculateCompScore(comp: CompData): number {
  // ========== 1. 平均排名得分（权重 50%）==========
  // 使用指数函数强化好排名的价值
  // avgPlace: 1.0-8.0，越小越好
  const avgPlace = Math.max(1.0, Math.min(8.0, comp.avgPlace || 4.5))

  // 归一化到 0-1 范围：(8.0 - avgPlace) / 7.0
  const normalizedAvgPlace = (8.0 - avgPlace) / 7.0

  // 使用指数函数：exp(x) - 1，强调优秀表现
  // 当 avgPlace = 1.0 时，normalizedAvgPlace = 1.0，得分最高
  // 当 avgPlace = 8.0 时，normalizedAvgPlace = 0.0，得分最低
  const avgPlaceScore = (Math.exp(normalizedAvgPlace * 2) - 1) / (Math.exp(2) - 1) * 100

  // ========== 2. 前四率得分（权重 25%）==========
  const top4Rate = comp.top4Rate || 0
  const top4Score = top4Rate // 直接使用，已经是百分比

  // ========== 3. 吃鸡率得分（权重 15%）==========
  const firstPlaceRate = comp.firstPlaceRate || 0
  // 吃鸡率通常较低，放大权重
  const firstPlaceScore = Math.min(100, firstPlaceRate * 3)

  // ========== 4. 选取率得分（权重 10%）==========
  // 使用对数函数降低选取率的影响，保护专属阵容
  const pickRate = comp.pickRate || 0.01 // 最小值 0.01% 防止 log(0)

  // 对数归一化：log(pickRate + 1)
  // 选取率从 0.01% 到 10% 映射到较小的得分差异
  const pickRateScore = Math.min(100, Math.log10(pickRate + 1) * 50 + 50)

  // ========== 加权计算综合得分 ==========
  const totalScore
    = avgPlaceScore * 0.40
      + top4Score * 0.20
      + firstPlaceScore * 0.10
      + pickRateScore * 0.30

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
 * 低出场率阵容特征：
 * 1. 选取率极低（< 0.25%）
 * 2. 平均排名 < 4.5
 *
 * @param comp 阵容数据
 * @returns 是否为低出场率阵容
 */
function isLowPickrateComp(comp: CompData): boolean {
  const pickRate = comp.pickRate || 0
  const avgPlace = comp.avgPlace || 8.0

  // 选取率阈值：0.25%
  const isLowPickRate = pickRate < 0.25

  // 平均排名要求 < 4.5
  const isGoodAvgPlace = avgPlace < 4.5

  return isLowPickRate && isGoodAvgPlace
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
export function enhanceComps(comps: CompData[]): EnhancedCompData[] {
  // 1. 分离低出场率阵容和普通阵容
  const lowPickrateComps: CompData[] = []
  const normalComps: CompData[] = []

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

/**
 * 按评级分组阵容
 *
 * @param comps 增强后的阵容数据
 * @returns 分组后的阵容数据
 */
export function groupCompsByTier(comps: EnhancedCompData[]): GroupedComps[] {
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

  // 每个分组内排序
  Object.values(groups).forEach((group) => {
    // 普通阵容按得分降序
    group.normal.sort((a, b) => b.score - a.score)
    // 低出场率阵容按平均排名升序
    group.lowPickrate.sort((a, b) => (a.avgPlace || 4.5) - (b.avgPlace || 4.5))
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
 * @returns 分组后的阵容数据
 */
export function processComps(comps: CompData[]): GroupedComps[] {
  const enhanced = enhanceComps(comps)
  return groupCompsByTier(enhanced)
}
