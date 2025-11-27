import type { AugmentsResponse } from './types'
import { getApiClient } from './client'

export async function getAugments(): Promise<AugmentsResponse> {
  const response = await getApiClient().get<AugmentsResponse>('/augments')
  return response.data
}
