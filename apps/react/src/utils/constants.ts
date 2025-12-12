/**
 * 游戏相关常量配置
 * 集中管理所有魔法数字，提高代码可维护性
 */

/**
 * TFT 游戏默认平均排名（中位值）
 * 8人局游戏，平均排名为 (1+8)/2 = 4.5
 */
export const DEFAULT_AVG_PLACE = 4.5

/**
 * 低出场率阈值（百分比）
 * 低于此值的阵容被归类为低出场率阵容
 */
export const LOW_PICK_RATE_THRESHOLD = 0.25

/**
 * 评级百分位阈值
 * 基于排名百分位来分配评级，确保每个评级都有合理的阵容分布
 */
export const TIER_PERCENTILES = {
  S: 0.10, // 前 10%
  A: 0.30, // 前 10%-30%
  B: 0.55, // 前 30%-55%
  C: 0.80, // 前 55%-80%
  D: 1.00, // 后 20%
} as const

/**
 * 阵容评分指标权重配置
 */
export const METRIC_WEIGHTS = {
  avgPlace: 0.40,
  top4Rate: 0.20,
  firstPlaceRate: 0.10,
  pickRate: 0.30,
} as const

/**
 * 标准化配置范围
 */
export const NORMALIZATION_CONFIG = {
  // 平均排名范围
  avgPlace: { min: 1.5, max: 8.0 },
  // 前四率范围（百分比）
  top4Rate: { min: 0.01, max: 95 },
  // 吃鸡率范围（百分比）
  firstPlaceRate: { min: 0.01, max: 70 },
  // 选取率范围（百分比）
  pickRate: { min: 0.01, max: 10 },
} as const

/**
 * 综合排序算法常量
 */
export const RANKING_CONFIG = {
  /** 低样本时向中性值收缩的强度，数值越大收缩越多 */
  SHRINKAGE_K: 20,
  /** 选取率平滑系数，数值越大越不敏感 */
  PICK_SOFTNESS: 5,
  /** 流行度权重 (0-1)，控制选取率的加成 */
  POP_WEIGHT: 0.2,
  /** 低样本置信度下限（0-1），抬高小样本的最低置信度 */
  LOW_SAMPLE_FLOOR: 0.2,
} as const
