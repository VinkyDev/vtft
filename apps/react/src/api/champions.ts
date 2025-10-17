import type { ChampionQueryParams, ChampionResponse } from './types'
import { arrayToString } from 'utils'
import { apiClient } from './client'

/**
 * 查询英雄数据
 * @param params 查询参数
 * @returns 英雄数据响应
 */
export async function queryChampions(params?: ChampionQueryParams): Promise<ChampionResponse> {
  const queryParams: Record<string, string | number> = {}

  if (params) {
    // 处理分页参数
    if (params.page !== undefined)
      queryParams.page = params.page
    if (params.pageSize !== undefined)
      queryParams.pageSize = params.pageSize

    // 处理筛选参数（数组转字符串）
    const costStr = arrayToString(params.cost)
    if (costStr)
      queryParams.cost = costStr

    const nameStr = arrayToString(params.name)
    if (nameStr)
      queryParams.name = nameStr

    // 处理排序参数
    if (params.sortBy)
      queryParams.sortBy = params.sortBy
    if (params.sortOrder)
      queryParams.sortOrder = params.sortOrder
  }

  const response = await apiClient.get<ChampionResponse>('/champions', { params: queryParams })
  return response.data
}
