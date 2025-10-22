/**
 * 强化符文数据 API 服务
 * 提供强化符文相关的查询功能
 */
import type { AugmentQueryParams, AugmentResponse } from './types'
import { arrayToString } from 'utils'
import { apiClient } from './client'

/**
 * 查询强化符文数据
 * @param params 查询参数
 * @returns 强化符文数据响应
 */
export async function queryAugments(params?: AugmentQueryParams): Promise<AugmentResponse> {
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

    // 处理 level（可能是单个值或数组）
    if (params.level) {
      const levelStr = Array.isArray(params.level) ? arrayToString(params.level) : params.level
      if (levelStr)
        queryParams.level = levelStr
    }

    // 处理 tier（可能是单个值或数组）
    if (params.tier) {
      const tierStr = Array.isArray(params.tier) ? arrayToString(params.tier) : params.tier
      if (tierStr)
        queryParams.tier = tierStr
    }

    // 处理排序参数
    if (params.sortBy)
      queryParams.sortBy = params.sortBy
    if (params.sortOrder)
      queryParams.sortOrder = params.sortOrder
  }

  const response = await apiClient.get<AugmentResponse>('/augments', { params: queryParams })
  return response.data
}
