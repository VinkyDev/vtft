import type { Comp, CompDetail, ItemStat, Lookups, Queue, TierList, UnitItemsProcessed, UnitStat } from 'types'

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface SeasonMapping { season: string, queue: Queue }

export interface SeasonQuery { season?: string }
export interface LookupsQuery { season?: string, queue?: Queue }

export type ItemsResponse = ApiResponse<ItemStat[]>
export type UnitsResponse = ApiResponse<UnitStat[]>
export type UnitItemsResponse = ApiResponse<UnitItemsProcessed>
export type AugmentsResponse = ApiResponse<TierList[]>
export type CompsResponse = ApiResponse<Comp[]>
export type CompDetailResponse = ApiResponse<CompDetail>
export type SeasonsResponse = ApiResponse<SeasonMapping[]>
export type LookupsResponse = ApiResponse<Lookups>
