import type { CompsData, CompsDetails, CompsStats, Lookups } from './quicktype/gen/comps'
import type { Augments, Items, Traits, Units } from './quicktype/gen/data'
import type { fetchCompsDetailsParams, fetchCompsStatsParams, fetchDataBasicParams, TFTSetString } from './types'
import { api } from './client'
import { Convert as CompsConvert } from './quicktype/gen/comps'
import { Convert as DataConvert } from './quicktype/gen/data'

/**
 * 获取中文基础数据
 * @param {TFTSetString} set  TFT集数
 * @returns {Promise<Lookups>} 中文基础数据
 */
export async function fetchLookupsData(set: TFTSetString): Promise<Lookups> {
  const res = await api.get(`https://data.metatft.com/lookups/${set}.json`)
  return CompsConvert.toLookups(JSON.stringify(res.data))
}

/**
 * 获取阵容数据
 * @param {fetchDataBasicParams} params
 * @returns {Promise<CompsData>} 阵容数据
 */
export async function fetchCompsData({ queue }: fetchDataBasicParams): Promise<CompsData> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comps_data?queue=${queue}`)
  return CompsConvert.toCompsData(JSON.stringify(res.data))
}

/**
 * 获取阵容统计数据
 * @param {fetchCompsStatsParams} params
 * @returns {Promise<CompsStats>} 阵容统计数据
 */
export async function fetchCompsStats({ queue, days = 1 }: fetchCompsStatsParams): Promise<CompsStats> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comps_stats?queue=${queue}&patch=current&days=${days}&permit_filter_adjustment=true`)
  return CompsConvert.toCompsStats(JSON.stringify(res.data))
}

/**
 * 获取阵容详情
 * @param {fetchCompsDetailsParams} params
 * @returns {Promise<CompsDetails>} 阵容详情
 */
export async function fetchCompsDetails({ queue, cluster_id, compId }: fetchCompsDetailsParams): Promise<CompsDetails> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comp_details?queue=${queue}&cluster_id=${cluster_id}&comp=${compId}`)
  return CompsConvert.toCompsDetails(JSON.stringify(res.data))
}

/**
 * 获取强化符文数据
 * @returns {Promise<Augments>} 强化符文数据
 */
export async function fetchAugments(): Promise<Augments> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/augments_tiers`)
  return DataConvert.toAugments(JSON.stringify(res.data))
}

/**
 * 获取单位数据
 * @param {fetchDataBasicParams} params
 * @returns {Promise<Units>} 单位数据
 */
export async function fetchUnits({ queue }: fetchDataBasicParams): Promise<Units> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/units?queue=${queue}&patch=current&days=1&permit_filter_adjustment=true`)
  return DataConvert.toUnits(JSON.stringify(res.data))
}

/**
 * 获取装备数据
 * @param {fetchDataBasicParams} params
 * @returns {Promise<Items>} 物品数据
 */
export async function fetchItems({ queue }: fetchDataBasicParams): Promise<Items> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/items?queue=${queue}&patch=current&days=1&permit_filter_adjustment=true`)
  return DataConvert.toItems(JSON.stringify(res.data))
}

/**
 * 获取羁绊数据
 * @param {fetchDataBasicParams} params
 * @returns {Promise<Traits>} 羁绊数据
 */
export async function fetchTraits({ queue }: fetchDataBasicParams): Promise<Traits> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/traits?queue=${queue}&patch=current&days=1&permit_filter_adjustment=true`)
  return DataConvert.toTraits(JSON.stringify(res.data))
}
