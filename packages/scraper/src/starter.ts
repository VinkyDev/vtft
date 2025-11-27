import type { Comp, CompDetail, ItemStat, UnitItemsProcessed, UnitStat } from 'types'
import type { TierList } from './quicktype/gen/data'
import type { fetchDataBasicParams } from './types'
import { isNil, omitBy, pick } from 'lodash-es'
import { fetchAugments, fetchCompsData, fetchCompsDetails, fetchCompsStats, fetchItems, fetchUnitItemsProcessed, fetchUnits } from './meta-tft'
import { transformCompsDetails, transformCompsStats, transformItemsStats, transformUnitsStats } from './utils'

/**
 * 获取指定队列的全部阵容基础数据
 */
export async function getAllCompsData({ queue }: fetchDataBasicParams): Promise<Comp[]> {
  const comps = await fetchCompsData({ queue })
  const compsStats = await fetchCompsStats({ queue })
  const parsedCompsStats = transformCompsStats(compsStats)

  const compData = comps.results?.data
  const clusterId = compData?.cluster_id || 0

  const result: Comp[] = []
  for (const [key, detail] of Object.entries(compData?.cluster_details || {})) {
    const stats = parsedCompsStats[key]
    if (!stats)
      continue

    const { avg, pickRate, firstRate, top4Rate } = stats
    if (!avg || !pickRate || !firstRate || !top4Rate)
      continue

    result.push({
      id: Number(key),
      clusterId: Number(clusterId),
      name: detail.name,
      avg,
      pickRate,
      firstRate,
      top4Rate,
      units: detail.units_string?.split(',').map(unit => unit.trim()) || [],
      traits: detail.traits_string?.split(',').map(trait => trait.trim()) || [],
      builds: detail.builds?.map(build => ({
        ...omitBy(pick(build, ['count', 'avg', 'unit', 'buildName']), isNil),
      })) || [],
      ...omitBy(pick(detail, ['stars', 'stars_4', 'levelling']), isNil),
    })
  }

  return result
}

/**
 * 获取单个阵容详情
 */
export async function getCompDetails(params: { queue: fetchDataBasicParams['queue'], clusterId: number, compId: string, compUnits: string[] }): Promise<CompDetail> {
  const { queue, clusterId, compId, compUnits } = params
  const raw = await fetchCompsDetails({ queue, cluster_id: clusterId, compId })
  const details = transformCompsDetails(raw, compUnits || [])
  return details
}

/**
 * 获取强化符文数据
 */
export async function getAugmentsData(): Promise<TierList[]> {
  const augments = await fetchAugments()
  return augments.content?.content?.tierList || []
}

/**
 * 获取装备数据
 */
export async function getItemsData({ queue }: fetchDataBasicParams): Promise<ItemStat[]> {
  const items = await fetchItems({ queue })
  return transformItemsStats(items)
}

/**
 * 获取单位数据
 */
export async function getUnitsData({ queue }: fetchDataBasicParams): Promise<UnitStat[]> {
  const units = await fetchUnits({ queue })
  return transformUnitsStats(units)
}
export async function getUnitItemsProcessedData(): Promise<UnitItemsProcessed> {
  const data = await fetchUnitItemsProcessed()
  return data
}
