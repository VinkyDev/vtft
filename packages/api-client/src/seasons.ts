import type { SeasonsResponse } from './types'
import { getApiClient } from './client'

export async function getSeasons(): Promise<SeasonsResponse> {
  const response = await getApiClient().get<SeasonsResponse>('/seasons')
  return response.data
}
