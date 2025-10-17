import type { ItemMeta } from 'types'
import { databaseService } from './database'

export interface ItemQueryOptions {
  page: number
  pageSize: number
  names?: string[]
  champion?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ItemQueryResult {
  data: ItemMeta[]
  count: number
  total: number
}

export class ItemService {
  async queryItems(options: ItemQueryOptions): Promise<ItemQueryResult> {
    const db = databaseService.getTFTDatabase()
    const { page, pageSize, names, champion, sortBy, sortOrder } = options

    // 构建筛选条件
    const filter: any = {}

    if (names && names.length > 0) {
      filter.name = { $in: names }
    }

    if (champion) {
      filter.recommendedFor = { $in: [champion] }
    }

    // 构建排序
    const sort: any = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // 获取总数
    const total = await db.items.count(filter)

    // 如果 page 或 pageSize 为 -1，返回全部数据
    if (page === -1 || pageSize === -1) {
      const data = await db.items.find(filter, { sort })
      return {
        data,
        count: data.length,
        total,
      }
    }

    // 否则使用分页
    const skip = (page - 1) * pageSize
    const data = await db.items.find(filter, { sort, skip, limit: pageSize })

    return {
      data,
      count: data.length,
      total,
    }
  }

  // 保留旧方法以兼容
  async getAllItems(): Promise<ItemMeta[]> {
    const db = databaseService.getTFTDatabase()
    return await db.items.findAll()
  }

  async getItemByName(name: string): Promise<ItemMeta | null> {
    const db = databaseService.getTFTDatabase()
    return await db.items.findByName(name)
  }
}

export const itemService = new ItemService()
