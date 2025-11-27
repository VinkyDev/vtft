import type { CompDetailResponse, CompsResponse, SeasonQuery } from './types'
import { getApiClient } from './client'

export async function getComps(params?: SeasonQuery): Promise<CompsResponse> {
  const response = await getApiClient().get<CompsResponse>('/comps', { params })
  return response.data
}

export async function getCompDetails(compId: string): Promise<CompDetailResponse> {
  const response = await getApiClient().get<CompDetailResponse>(`/comps/${compId}`)
  return response.data
}
