import type { ItemQueryParams, ItemResponse } from './types'
import { arrayToString } from 'utils'
import { apiClient } from './client'

/**
 * 查询装备数据
 * @param params 查询参数
 * @returns 装备数据响应
 */
export async function queryItems(params?: ItemQueryParams): Promise<ItemResponse> {
  const queryParams: Record<string, string | number> = {}

  if (params) {
    // 处理分页参数
    if (params.page !== undefined)
      queryParams.page = params.page
    if (params.pageSize !== undefined)
      queryParams.pageSize = params.pageSize

    // 处理筛选参数
    const nameStr = arrayToString(params.name)
    if (nameStr)
      queryParams.name = nameStr

    if (params.champion)
      queryParams.champion = params.champion

    // 处理排序参数
    if (params.sortBy)
      queryParams.sortBy = params.sortBy
    if (params.sortOrder)
      queryParams.sortOrder = params.sortOrder
  }

  const response = await apiClient.get<ItemResponse>('/items', { params: queryParams })
  return response.data
}
