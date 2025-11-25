import type { Comp, CompDetail, ItemStat, UnitStat } from 'types'
import type { TierList } from './quicktype/gen/data'
import { isNil, omitBy, pick } from 'lodash-es'
import logger from 'logger'
import { fetchAugments, fetchCompsData, fetchCompsDetails, fetchCompsStats, fetchItems, fetchUnits } from './meta-tft'
import { Queue } from './types'
import { transformCompsDetails, transformCompsStats, transformItemsStats, transformUnitsStats } from './utils'

/**
 * 获取指定队列的阵容&阵容详情数据
 * @param queue 队列类型
 */
export async function getCompsData(queue: Queue): Promise<void> {
  // 获取阵容数据
  const comps = await fetchCompsData({ queue })
  // 获取阵容统计数据
  const compsStats = await fetchCompsStats({ queue })
  const parsedCompsStats = transformCompsStats(compsStats)

  const compData = comps.results?.data

  const clusterId = compData?.cluster_id || 0

  // 处理后阵容数据
  const compsData: Comp[] = []
  for (const [key, detail] of Object.entries(compData?.cluster_details || {})) {
    const { avg, pickRate, firstRate, top4Rate } = parsedCompsStats[key] || {}

    if (!avg || !pickRate || !firstRate || !top4Rate)
      continue

    compsData.push({
      id: Number(key),
      clusterId: Number(clusterId),
      name: detail.name_string,
      avg,
      pickRate,
      firstRate,
      top4Rate,
      units: detail.units_string?.split(',') || [],
      traits: detail.traits_string?.split(',') || [],
      builds: detail.builds?.map(build => ({
        ...omitBy(pick(build, ['count', 'avg', 'unit', 'buildName']), isNil),
      })) || [],
      ...omitBy(pick(detail, ['stars', 'stars_4', 'levelling']), isNil),
    })
  }

  // 获取阵容详情数据
  const compsDetails: CompDetail[] = []
  for (const comp of compsData) {
    const { id, units } = comp
    const rawCompsDetails = await fetchCompsDetails({ queue, cluster_id: clusterId, compId: String(id) })

    // 使用 transformCompsDetails 转换阵容详情数据
    const transformedDetails = transformCompsDetails(rawCompsDetails, units || [])
    compsDetails.push(transformedDetails)
  }

  logger.debug(`positioning: ${JSON.stringify(compsDetails[0]?.positioning)}`)
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
export async function getItemsData({ queue }: { queue: Queue }): Promise<ItemStat[]> {
  const items = await fetchItems({ queue })
  return transformItemsStats(items)
}

/**
 * 获取单位数据
 */
export async function getUnitsData({ queue }: { queue: Queue }): Promise<UnitStat[]> {
  const units = await fetchUnits({ queue })
  return transformUnitsStats(units)
}

getCompsData(Queue.PBE)
