import type { ChampionMeta } from 'types'
import { databaseService } from './database'

export interface ChampionQueryOptions {
  page: number
  pageSize: number
  costs?: number[]
  names?: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ChampionQueryResult {
  data: ChampionMeta[]
  count: number
  total: number
}

export class ChampionService {
  async queryChampions(options: ChampionQueryOptions): Promise<ChampionQueryResult> {
    const db = databaseService.getTFTDatabase()
    const { page, pageSize, costs, names, sortBy, sortOrder } = options

    // 构建筛选条件
    const filter: any = {}

    if (costs && costs.length > 0) {
      filter.cost = { $in: costs }
    }

    if (names && names.length > 0) {
      filter.name = { $in: names }
    }

    // 构建排序
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 获取总数
    const total = await db.champions.count(filter)

    // 如果 page 或 pageSize 为 -1，返回全部数据
    if (page === -1 || pageSize === -1) {
      const data = await db.champions.find(filter, { sort })
      return {
        data,
        count: data.length,
        total,
      }
    }

    // 否则使用分页
    const skip = (page - 1) * pageSize
    const data = await db.champions.find(filter, { sort, skip, limit: pageSize })

    return {
      data,
      count: data.length,
      total,
    }
  }
}

export const championService = new ChampionService()
