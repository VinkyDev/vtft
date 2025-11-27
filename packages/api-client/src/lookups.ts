import type { LookupsQuery, LookupsResponse } from './types'
import { getApiClient } from './client'

/**
 * 获取基础数据
 */
export async function getLookups({ season }: LookupsQuery): Promise<LookupsResponse> {
  const response = await getApiClient().get<LookupsResponse>('/lookups', { params: { season } })
  return response.data
}
