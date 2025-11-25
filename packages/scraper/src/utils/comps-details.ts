import type { CompDetail, CompItem, Option, Positioning } from 'types'
import type { CompsDetails, Option as CompsOption, Counter, EarlyOption, ItemName, Positioning as RawPositioning, Trend as RawTrend } from '../quicktype/gen/comps'
import { compact, mapValues, orderBy, sortBy, sum } from 'lodash-es'
import { Trend } from 'types'

export function transformCompsDetails(compsDetails: CompsDetails, compUnits: string[]): CompDetail {
  const results = compsDetails.results
  if (!results) return {}
  return {
    id: results.cluster ? Number(results.cluster) : undefined,
    counters: results.counters as Counter[] | undefined,
    final_level: (results.final_levels),
    item: transformItems(results.itemNames),
    trends: calculateTrend(results.trends),
    positioning: transformPositioning(results.positioning, compUnits),
    early_options: transformEarlyOptions(results.early_options),
    options: transformLateOptions(results.options),
  }
}

function transformItems(itemNames?: ItemName[]): CompItem[] | undefined {
  if (!itemNames || itemNames.length === 0) return undefined
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

function calculateTrend(trends?: RawTrend[]): Trend | undefined {
  if (!trends || trends.length < 2) return undefined
  const sortedTrends = sortBy(trends, 'day')
  const recentTrends = sortedTrends.slice(-3)
  const avgChanges = []
  for (let i = 1; i < recentTrends.length; i++) {
    const current = recentTrends[i]?.avg ?? 0
    const previous = recentTrends[i - 1]?.avg ?? 0
    avgChanges.push(current - previous)
  }
  if (avgChanges.length === 0) return Trend.Steady
  const avgChange = sum(avgChanges) / avgChanges.length
  if (avgChange < -0.1) return Trend.Up
  if (avgChange > 0.1) return Trend.Down
  return Trend.Steady
}

function transformPositioning(positioning?: RawPositioning, compUnits?: string[]): Positioning[] | undefined {
  if (!positioning?.units || !compUnits || compUnits.length === 0) return undefined
  const unitPositions = compact(
    compUnits.map((unitName) => {
      const trimmedUnitName = unitName.trim()
      const unitData = positioning.units?.[trimmedUnitName]
      if (!unitData?.positions) return null
      const sortedPositions = orderBy(
        unitData.positions.map(p => ({
          position: Number(p.cell?.replace('cell_', '') || 0),
          count: p.count || 0,
        })),
        ['count'],
        ['desc'],
      )
      return { unit: trimmedUnitName, positions: sortedPositions }
    }),
  ).filter(item => item.positions.length > 0)

  const sortedUnits = orderBy(unitPositions, [u => u.positions[0]?.count ?? 0], ['desc'])
  const usedPositions = new Set<number>()
  const result: Positioning[] = []
  for (const unitData of sortedUnits) {
    const availablePosition = unitData.positions.find(p => !usedPositions.has(p.position))
    if (availablePosition) {
      usedPositions.add(availablePosition.position)
      result.push({ unit: unitData.unit, position: availablePosition.position })
    }
  }
  return result.length > 0 ? result : undefined
}

function transformEarlyOptions(earlyOptions?: Record<string, EarlyOption[]>): Record<string, Option[]> | undefined {
  if (!earlyOptions) return undefined
  return mapValues(earlyOptions, optionArray =>
    optionArray.map(option => ({
      unit_list: option.unit_list,
      count: option.count,
      avg: option.avg,
      win: option.win,
    })))
}

function transformLateOptions(lateOptions?: Record<string, CompsOption[]>): Record<string, Option[]> | undefined {
  if (!lateOptions) return undefined
  return mapValues(lateOptions, optionArray =>
    optionArray.map(option => ({
      unit_list: option.units_list,
      count: option.count,
      avg: option.avg,
    })))
}

