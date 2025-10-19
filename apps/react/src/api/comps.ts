import type { CompDetailsResponse, CompQueryParams, CompResponse } from './types'
/**
 * 阵容数据 API 服务
 * 提供阵容相关的查询功能
 */
import { apiClient } from './client'

/**
 * 查询阵容数据
 * @param params 查询参数
 * @returns 阵容数据响应
 */
export async function queryComps(params?: CompQueryParams): Promise<CompResponse> {
  const queryParams: Record<string, string | number> = {}

  if (params) {
    // 处理分页参数
    if (params.page !== undefined)
      queryParams.page = params.page
    if (params.pageSize !== undefined)
      queryParams.pageSize = params.pageSize

    // 处理筛选参数
    if (params.name)
      queryParams.name = params.name

    if (params.tier)
      queryParams.tier = params.tier

    if (params.levelType)
      queryParams.levelType = params.levelType

    // 处理排序参数
    if (params.sortBy)
      queryParams.sortBy = params.sortBy
    if (params.sortOrder)
      queryParams.sortOrder = params.sortOrder
  }

  const response = await apiClient.get<CompResponse>('/comps', { params: queryParams })
  return response.data
}

/**
 * 获取阵容详情
 * @param compId 阵容ID
 * @returns 阵容详情
 */
export async function getCompDetails(compId: string): Promise<CompDetailsResponse> {
  const response = await apiClient.get<CompDetailsResponse>(`/comps/${compId}?includeDetails=true`)
  return response.data
}
