import type { CompDetail, CompItem, Option, Positioning } from 'types'
import type { CompsDetails, Option as CompsOption, CompsStats, Counter, EarlyOption, ItemName, Positioning as RawPositioning, Trend as RawTrend } from './quicktype/gen/comps'
import { compact, mapValues, orderBy, sortBy, sum } from 'lodash-es'
import { Trend } from 'types'

interface ParsedCluster {
  avg: number
  pickRate: number
  top4Rate: number
  firstRate: number
}

export function transformCompsStats(data: CompsStats): Record<string, ParsedCluster> {
  let totalMatches = 0

  for (const item of data.results || []) {
    if (item.cluster === '') {
      totalMatches = item.places?.[0] || 0
      break
    }
  }

  if (!totalMatches)
    throw new Error('Missing total matches (cluster: \'\').')

  const result: Record<string, ParsedCluster> = {}

  for (const item of data.results || []) {
    const { cluster, places } = item

    if (!cluster)
      continue
    if (cluster === '')
      continue

    const top8 = places?.slice(0, 8) || []

    const count = item.count ?? top8.reduce((a, b) => a + b, 0)
    let totalScore = 0
    for (let i = 0; i < top8.length; i++) {
      totalScore += (i + 1) * (top8[i] || 0)
    }
    const avg = totalScore / count

    const pickRate = (count / totalMatches) * 8
    const firstRate = (top8[0] || 0) / count
    const top4Rate
      = top8.slice(0, 4).reduce((a, b) => a + b, 0) / count

    result[cluster] = {
      avg,
      pickRate,
      firstRate,
      top4Rate,
    }
  }

  return result
}

/**
 * 转换阵容详情数据为 CompDetail 类型
 * @param compsDetails CompsDetails 类型的原始数据
 * @param compUnits 阵容中的英雄单位列表（来自 comps 数据）
 * @returns CompDetail 类型的转换后数据
 */
export function transformCompsDetails(compsDetails: CompsDetails, compUnits: string[]): CompDetail {
  const results = compsDetails.results

  if (!results) {
    return {}
  }

  return {
    // 阵容 ID - 从 results.cluster 转换为 number
    id: results.cluster ? Number(results.cluster) : undefined,

    // 克制关系 - 直接使用
    counters: results.counters as Counter[] | undefined,

    // 最终等级 - 转换并确保 level 字段是 string
    final_level: (results.final_levels),

    // 装备数据 - 转换 ItemName[] 为 CompItem[]
    item: transformItems(results.itemNames),

    // 趋势 - 计算趋势方向
    trends: calculateTrend(results.trends),

    // 站位 - 处理复杂的站位逻辑
    positioning: transformPositioning(results.positioning, compUnits),

    // 早期选项 - 转换数据结构
    early_options: transformEarlyOptions(results.early_options),

    // 后期选项 - 转换数据结构
    options: transformLateOptions(results.options),
  }
}

/**
 * 转换装备数据
 */
function transformItems(itemNames?: ItemName[]): CompItem[] | undefined {
  if (!itemNames || itemNames.length === 0)
    return undefined

  return itemNames.map(item => ({
    itemNames: item.itemNames || '',
    count: item.count,
    avg: item.avg,
    pcnt: item.pcnt,
    units: item.units?.map(unit => ({
      count: unit.count,
      avg: unit.avg,
      units: unit.units,
      place_change: unit.place_change,
      unit_pick: unit.unit_pick,
      item_pick: unit.item_pick,
    })),
  }))
}

/**
 * 计算趋势方向
 * 基于最近几天的平均排名变化来判断趋势
 */
function calculateTrend(trends?: RawTrend[]): Trend | undefined {
  if (!trends || trends.length < 2)
    return undefined

  // 按日期排序
  const sortedTrends = sortBy(trends, 'day')

  // 计算最近趋势的平均排名变化
  const recentTrends = sortedTrends.slice(-3) // 取最近3天的数据
  const avgChanges = []

  for (let i = 1; i < recentTrends.length; i++) {
    const current = recentTrends[i]?.avg ?? 0
    const previous = recentTrends[i - 1]?.avg ?? 0
    avgChanges.push(current - previous)
  }

  if (avgChanges.length === 0)
    return Trend.Steady

  const avgChange = sum(avgChanges) / avgChanges.length

  // 排名越低越好（1是最好的），所以如果 avg 下降，趋势是上升
  if (avgChange < -0.1)
    return Trend.Up // 排名变好，趋势向上
  if (avgChange > 0.1)
    return Trend.Down // 排名变差，趋势向下
  return Trend.Steady
}

/**
 * 转换站位数据
 * 处理逻辑：
 * 1. 只保留 compUnits 中的英雄单位
 * 2. 每个单位选择 count 最多的站位
 * 3. 去掉 cell_ 前缀，只保留数字
 * 4. 确保不同单位的站位不重复，如果重复则顺延
 */
function transformPositioning(positioning?: RawPositioning, compUnits?: string[]): Positioning[] | undefined {
  if (!positioning?.units || !compUnits || compUnits.length === 0)
    return undefined

  // 收集所有单位的候选站位（按 count 排序）
  const unitPositions = compact(
    compUnits.map((unitName) => {
      const trimmedUnitName = unitName.trim()
      const unitData = positioning.units?.[trimmedUnitName]
      if (!unitData?.positions)
        return null

      // 按 count 降序排序所有可能的站位
      const sortedPositions = orderBy(
        unitData.positions.map(p => ({
          position: Number(p.cell?.replace('cell_', '') || 0),
          count: p.count || 0,
        })),
        ['count'],
        ['desc'],
      )

      return {
        unit: trimmedUnitName,
        positions: sortedPositions,
      }
    }),
  ).filter(item => item.positions.length > 0)

  // 按第一个候选站位的 count 降序排序（count 高的优先选择）
  const sortedUnits = orderBy(unitPositions, [u => u.positions[0]?.count ?? 0], ['desc'])

  // 分配站位，确保不重复
  const usedPositions = new Set<number>()
  const result: Positioning[] = []

  for (const unitData of sortedUnits) {
    // 找到第一个未被使用的站位
    const availablePosition = unitData.positions.find(p => !usedPositions.has(p.position))

    if (availablePosition) {
      usedPositions.add(availablePosition.position)
      result.push({
        unit: unitData.unit,
        position: availablePosition.position,
      })
    }
  }

  return result.length > 0 ? result : undefined
}

/**
 * 转换早期选项数据结构
 */
function transformEarlyOptions(earlyOptions?: Record<string, EarlyOption[]>): Record<string, Option[]> | undefined {
  if (!earlyOptions)
    return undefined

  return mapValues(earlyOptions, optionArray =>
    optionArray.map(option => ({
      unit_list: option.unit_list,
      count: option.count,
      avg: option.avg,
      win: option.win,
    })))
}

/**
 * 转换后期选项数据结构
 */
function transformLateOptions(lateOptions?: Record<string, CompsOption[]>): Record<string, Option[]> | undefined {
  if (!lateOptions)
    return undefined

  return mapValues(lateOptions, optionArray =>
    optionArray.map(option => ({
      unit_list: option.units_list,
      count: option.count,
      avg: option.avg,
    })))
}
