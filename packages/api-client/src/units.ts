import type { SeasonQuery, UnitsResponse } from './types'
import { getApiClient } from './client'

export async function getUnits(params?: SeasonQuery): Promise<UnitsResponse> {
  const response = await getApiClient().get<UnitsResponse>('/units', { params })
  return response.data
}
