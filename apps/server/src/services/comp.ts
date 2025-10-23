import type { CompData, CompDetails } from 'types'
import { databaseService } from './database'

export interface CompQueryOptions {
  page: number
  pageSize: number
  name?: string
  tier?: string
  levelType?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface CompQueryResult {
  data: CompData[]
  count: number
  total: number
}

export class CompService {
  async queryComps(options: CompQueryOptions): Promise<CompQueryResult> {
    const db = databaseService.getTFTDatabase()
    const { page, pageSize, name, tier, levelType, sortBy, sortOrder } = options

    // 构建筛选条件
    const filter: any = {}

    if (name) {
      filter.name = { $regex: name, $options: 'i' } // 模糊匹配
    }

    if (tier) {
      filter.tier = tier
    }

    if (levelType) {
      filter.levelType = levelType
    }

    // 构建排序
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 获取总数
    const total = await db.comps.count(filter)

    // 如果 page 或 pageSize 为 -1，返回全部数据
    if (page === -1 || pageSize === -1) {
      const data = await db.comps.find(filter, { sort })
      return {
        data,
        count: data.length,
        total,
      }
    }

    // 否则使用分页
    const skip = (page - 1) * pageSize
    const data = await db.comps.find(filter, { sort, skip, limit: pageSize })

    return {
      data,
      count: data.length,
      total,
    }
  }

  async getCompByCompId(compId: string): Promise<CompData | null> {
    const db = databaseService.getTFTDatabase()
    return await db.comps.findByCompId(compId)
  }

  async getCompDetails(compId: string): Promise<CompDetails | null> {
    const db = databaseService.getTFTDatabase()
    return await db.compDetails.getDetails(compId)
  }
}

export const compService = new CompService()
