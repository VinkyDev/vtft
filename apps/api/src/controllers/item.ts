import type { Context } from 'hono'
import { itemService } from '../services'

export class ItemController {
  /**
   * 统一的装备查询接口
   * 支持参数：
   * - page: 页码（从1开始，-1表示不分页，默认-1）
   * - pageSize: 每页数量（-1表示不分页，默认-1）
   * - name: 名称筛选，支持逗号分隔
   * - champion: 推荐英雄筛选
   * - sortBy: 排序字段（rank/avgPlace/top4Rate，默认rank）
   * - sortOrder: 排序方向（asc/desc，默认asc）
   */
  async query(c: Context) {
    try {
      const page = Number(c.req.query('page') ?? '-1')
      const pageSize = Number(c.req.query('pageSize') ?? '-1')
      const sortBy = c.req.query('sortBy') || 'rank'
      const sortOrder = c.req.query('sortOrder') || 'asc'
      const champion = c.req.query('champion')

      const nameParam = c.req.query('name')
      const names = nameParam ? nameParam.split(',').map(s => s.trim()).filter(Boolean) : undefined

      // 参数验证
      if (Number.isNaN(page) || (page !== -1 && page < 1)) {
        return c.json({
          success: false,
          message: 'Invalid page. Must be -1 or a positive number',
        }, 400)
      }

      if (Number.isNaN(pageSize) || (pageSize !== -1 && (pageSize < 1 || pageSize > 100))) {
        return c.json({
          success: false,
          message: 'Invalid pageSize. Must be -1 or between 1 and 100',
        }, 400)
      }

      const result = await itemService.queryItems({
        page,
        pageSize,
        names,
        champion,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      })

      const isPaginated = page !== -1 && pageSize !== -1

      return c.json({
        success: true,
        data: result.data,
        count: result.count,
        total: result.total,
        pagination: isPaginated
          ? {
              page,
              pageSize,
              totalPages: Math.ceil(result.total / pageSize),
            }
          : undefined,
      })
    }
    catch (error) {
      return c.json({
        success: false,
        message: 'Failed to query items',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 500)
    }
  }
}

export const itemController = new ItemController()
