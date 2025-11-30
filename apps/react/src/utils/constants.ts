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
  /** 流行度加成上限 */
  POPULARITY_CAP: 5,
  /** ECDF 幂次调整 */
  CONFIDENCE_ECDF_POWER: 0.3,
  /** Count 幂次调整 */
  CONFIDENCE_COUNT_POWER: 0.5,
  /** 贝叶斯收缩强度系数 */
  SHRINKAGE_STRENGTH: 1.0,
  /** 样本比调整强度系数 */
  SAMPLE_RATIO_STRENGTH: 1.0,
  /** 必要性混合强度 */
  MANDATORY_BLEND_STRENGTH: 0.6,
  /** 必要性阈值 */
  NECESSITY_THRESHOLD: 0.8,
  /** 必要性幂次 */
  NECESSITY_POWER: 0.7,
} as const

