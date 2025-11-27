import type { ItemsResponse, SeasonQuery } from './types'
import { getApiClient } from './client'

/**
 * 查询装备数据
 * @param params 查询参数
 * @returns 装备数据响应
 */
export async function getItems(params?: SeasonQuery): Promise<ItemsResponse> {
  const response = await getApiClient().get<ItemsResponse>('/items', { params })
  return response.data
}
