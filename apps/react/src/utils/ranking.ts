import { DEFAULT_AVG_PLACE, RANKING_CONFIG } from './constants'

const { SHRINKAGE_K, PICK_SOFTNESS, POP_WEIGHT, LOW_SAMPLE_FLOOR } = RANKING_CONFIG

/**
 * 为数据项批量计算综合得分
 * @param items 数据项数组
 * @returns 带有综合得分的数据项数组
 */
export function rankItems<T extends { pickRate: number, impact: number }>(
  items: T[],
): (T & { compositeScore: number })[] {
  return items.map((item) => {
    const avgRank = item.impact + DEFAULT_AVG_PLACE
    const impact = avgRank - DEFAULT_AVG_PLACE
    const shrunkImpact = (impact * item.pickRate) / (item.pickRate + SHRINKAGE_K)
    const quality = Math.max(0, Math.min(100, 50 - shrunkImpact * 25))

    const confidenceBase = item.pickRate <= 0
      ? 0
      : item.pickRate / (item.pickRate + PICK_SOFTNESS)
    const confidence = item.pickRate <= 0
      ? 0
      : Math.min(1, LOW_SAMPLE_FLOOR + (1 - LOW_SAMPLE_FLOOR) * confidenceBase)

    const boostedQuality = quality * (0.6 + 0.4 * confidence)
    const popularityBonus = POP_WEIGHT * confidence * 100
    const compositeScore = Math.min(100 + POP_WEIGHT * 100, boostedQuality + popularityBonus)

    return { ...item, compositeScore }
  })
}
