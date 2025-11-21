import type { CompsData, CompsDetails, CompsStats, Lookups } from './quicktype/gen/comps'
import type { Augments, Items, Traits, Units } from './quicktype/gen/data'
import { api } from './client'
import { Convert as CompsConvert } from './quicktype/gen/comps'
import { Convert as DataConvert } from './quicktype/gen/data'

const QUEUE = 'PBE'

/** 阵容数据  */
export async function fetchLookupsData(): Promise<Lookups> {
  const res = await api.get(`https://data.metatft.com/lookups/TFTSet16_pbe_zh_cn.json`)
  return CompsConvert.toLookups(JSON.stringify(res.data))
}

export async function fetchCompsData({ queue = QUEUE }): Promise<CompsData> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comps_data?queue=${queue}`)
  return CompsConvert.toCompsData(JSON.stringify(res.data))
}

export async function fetchCompsStats({ queue = QUEUE }): Promise<CompsStats> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comps_stats?queue=${queue}`)
  return CompsConvert.toCompsStats(JSON.stringify(res.data))
}

export async function fetchCompsDetails({ queue = QUEUE, cluster_id = 365 }): Promise<CompsDetails> {
  const res = await api.get(`https://api-hc.metatft.com/tft-comps-api/comps_details?queue=${queue}&cluster_id=${cluster_id}`)
  return CompsConvert.toCompsDetails(JSON.stringify(res.data))
}

/** 基础数据信息  */
export async function fetchAugments(): Promise<Augments> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/augments_tiers`)
  return DataConvert.toAugments(JSON.stringify(res.data))
}

export async function fetchUnits({ queue = QUEUE }): Promise<Units> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/units?queue=${queue}&patch=current`)
  return DataConvert.toUnits(JSON.stringify(res.data))
}

export async function fetchItems({ queue = QUEUE }): Promise<Items> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/items?queue=${queue}&patch=current`)
  return DataConvert.toItems(JSON.stringify(res.data))
}

export async function fetchTraits({ queue = QUEUE }): Promise<Traits> {
  const res = await api.get(`https://api-hc.metatft.com/tft-stat-api/traits?queue=${queue}&patch=current`)
  return DataConvert.toTraits(JSON.stringify(res.data))
}
