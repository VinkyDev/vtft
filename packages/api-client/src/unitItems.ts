import type { UnitItemsResponse } from './types'
import { getApiClient } from './client'

export async function getUnitItems(): Promise<UnitItemsResponse> {
  const response = await getApiClient().get<UnitItemsResponse>('/unit-items')
  return response.data
}
