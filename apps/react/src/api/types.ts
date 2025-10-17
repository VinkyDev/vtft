/**
 * API 请求和响应类型定义
 * 复用 types 包中的类型，添加 API 特定的类型
 */
import type { AugmentLevel, AugmentMeta, ChampionMeta, CompData, ItemMeta } from 'types'

/** 分页信息 */
export interface Pagination {
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/** API 响应基础结构 */
export interface ApiResponse<T> {
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data: T
  /** 当前返回的数据数量 */
  count: number
  /** 符合条件的总数据量 */
  total: number
  /** 分页信息（仅在分页时存在） */
  pagination?: Pagination
}

/** API 错误响应 */
export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
}

/** 排序方向 */
export type SortOrder = 'asc' | 'desc'

/** 基础查询参数 */
export interface BaseQueryParams {
  /** 页码（-1 表示不分页） */
  page?: number
  /** 每页数量（-1 表示不分页） */
  pageSize?: number
  /** 排序字段 */
  sortBy?: string
  /** 排序方向 */
  sortOrder?: SortOrder
}

/** 英雄查询参数 */
export interface ChampionQueryParams extends BaseQueryParams {
  /** 费用筛选（数组） */
  cost?: number[]
  /** 名称筛选（数组） */
  name?: string[]
  /** 排序字段 */
  sortBy?: 'rank' | 'cost' | 'avgPlace' | 'top4Rate' | 'firstPlaceRate'
}

/** 装备查询参数 */
export interface ItemQueryParams extends BaseQueryParams {
  /** 名称筛选（数组） */
  name?: string[]
  /** 推荐英雄筛选 */
  champion?: string
  /** 排序字段 */
  sortBy?: 'rank' | 'avgPlace' | 'top4Rate' | 'firstPlaceRate'
}

/** 强化符文查询参数 */
export interface AugmentQueryParams extends BaseQueryParams {
  /** 名称筛选（数组） */
  name?: string[]
  /** 级别筛选 */
  level?: AugmentLevel | AugmentLevel[]
  /** 段位筛选 */
  tier?: string | string[]
  /** 排序字段 */
  sortBy?: 'rank' | 'avgPlace' | 'top4Rate' | 'firstPlaceRate'
}

/** 阵容查询参数 */
export interface CompQueryParams extends BaseQueryParams {
  /** 名称筛选（模糊匹配） */
  name?: string
  /** 段位筛选 */
  tier?: string
  /** 类型筛选 */
  levelType?: string
  /** 排序字段 */
  sortBy?: 'rank' | 'pickRate' | 'firstPlaceRate' | 'avgPlace' | 'top4Rate'
}

/** 阵容详情查询参数 */
export interface CompByIdParams {
  /** 阵容 ID */
  compId: string
  /** 是否包含详细信息 */
  includeDetails?: boolean
}

// 导出响应类型（复用 types 包中的类型）
export type ChampionResponse = ApiResponse<ChampionMeta[]>
export type ItemResponse = ApiResponse<ItemMeta[]>
export type AugmentResponse = ApiResponse<AugmentMeta[]>
export type CompResponse = ApiResponse<CompData[]>
export type CompByIdResponse = ApiResponse<CompData>
