/**
 * 综合排序工具
 * 用于英雄、装备等数据的综合得分排序
 */

import type { CompItem, ItemStat, UnitStat } from 'types'
import { DEFAULT_AVG_PLACE } from './constants'
import { rankItems } from './ranking'

/**
 * 带综合得分的临时类型
 */
type WithCompositeScore<T> = T & { compositeScore: number }

/**
 * 综合排序英雄列表
 * @param items - 英雄列表
 * @returns 排序后的英雄列表(包含临时 compositeScore 字段)
 */
export function compositeSortChampions(
  items: UnitStat[],
): WithCompositeScore<UnitStat>[] {
  const rankedData = rankItems(
    items.map(item => ({
      pickRate: item.pickRate ?? 0,
      impact: item.avg !== undefined ? item.avg - DEFAULT_AVG_PLACE : 0,
    })),
  )

  // 将综合得分附加回原数据
  const itemsWithScore = items.map((item, index) => ({
    ...item,
    compositeScore: rankedData[index]?.compositeScore ?? 0,
  }))

  // 按综合得分降序排序
  return itemsWithScore.sort((a, b) => b.compositeScore - a.compositeScore)
}

/**
 * 综合排序装备列表
 * @param items - 装备列表
 * @returns 排序后的装备列表(包含临时 compositeScore 字段)
 */
export function compositeSortItems(
  items: ItemStat[],
): WithCompositeScore<ItemStat>[] {
  const rankedData = rankItems(
    items.map(item => ({
      pickRate: item.pickRate ?? 0,
      impact: item.avg !== undefined ? item.avg - DEFAULT_AVG_PLACE : 0,
    })),
  )

  // 将综合得分附加回原数据
  const itemsWithScore = items.map((item, index) => ({
    ...item,
    compositeScore: rankedData[index]?.compositeScore ?? 0,
  }))

  // 按综合得分降序排序
  return itemsWithScore.sort((a, b) => b.compositeScore - a.compositeScore)
}

export function compositeSortCompItems(
  items: CompItem[],
): (CompItem & { compositeScore: number })[] {
  const rankedData = rankItems(
    items.map(item => ({
      pickRate: item.pcnt !== undefined ? item.pcnt * 100 : 0,
      impact: item.avg !== undefined ? item.avg - DEFAULT_AVG_PLACE : 0,
    })),
  )

  const itemsWithScore = items.map((item, index) => ({
    ...item,
    compositeScore: rankedData[index]?.compositeScore ?? 0,
  }))

  return itemsWithScore.sort((a, b) => b.compositeScore - a.compositeScore)
}
