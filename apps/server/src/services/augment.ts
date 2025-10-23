import type { AugmentLevel, AugmentMeta } from 'types'
import { databaseService } from './database'

export interface AugmentQueryOptions {
  page: number
  pageSize: number
  names?: string[]
  levels?: AugmentLevel[]
  tiers?: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface AugmentQueryResult {
  data: AugmentMeta[]
  count: number
  total: number
}

export class AugmentService {
  async queryAugments(options: AugmentQueryOptions): Promise<AugmentQueryResult> {
    const db = databaseService.getTFTDatabase()
    const { page, pageSize, names, levels, tiers, sortBy, sortOrder } = options

    // 构建筛选条件
    const filter: any = {}

    if (names && names.length > 0) {
      filter.name = { $in: names }
    }

    if (levels && levels.length > 0) {
      filter.level = { $in: levels }
    }

    if (tiers && tiers.length > 0) {
      filter.tier = { $in: tiers }
    }

    // 构建排序
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 获取总数
    const total = await db.augments.count(filter)

    // 如果 page 或 pageSize 为 -1，返回全部数据
    if (page === -1 || pageSize === -1) {
      const data = await db.augments.find(filter, { sort })
      return {
        data,
        count: data.length,
        total,
      }
    }

    // 否则使用分页
    const skip = (page - 1) * pageSize
    const data = await db.augments.find(filter, { sort, skip, limit: pageSize })

    return {
      data,
      count: data.length,
      total,
    }
  }

  // 保留旧方法以兼容
  async getAllAugments(): Promise<AugmentMeta[]> {
    const db = databaseService.getTFTDatabase()
    return await db.augments.findAll()
  }

  async getAugmentByName(name: string): Promise<AugmentMeta | null> {
    const db = databaseService.getTFTDatabase()
    return await db.augments.findByName(name)
  }
}

export const augmentService = new AugmentService()
