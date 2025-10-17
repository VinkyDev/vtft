import type { Context } from 'hono'
import { championService } from '../services'

export class ChampionController {
  /**
   * 统一的英雄查询接口
   * 支持参数：
   * - page: 页码（从1开始，-1表示不分页，默认-1）
   * - pageSize: 每页数量（-1表示不分页，默认-1）
   * - cost: 费用筛选，支持逗号分隔（如: "1,2,3"）
   * - name: 名称筛选，支持逗号分隔（如: "李青,剑圣"）
   * - sortBy: 排序字段（rank/cost/avgPlace/top4Rate，默认rank）
   * - sortOrder: 排序方向（asc/desc，默认asc）
   */
  async query(c: Context) {
    try {
      // 解析查询参数，默认值为 -1（不分页）
      const page = Number(c.req.query('page') ?? '-1')
      const pageSize = Number(c.req.query('pageSize') ?? '-1')
      const sortBy = c.req.query('sortBy') || 'rank'
      const sortOrder = c.req.query('sortOrder') || 'asc'

      // 解析数组参数
      const costParam = c.req.query('cost')
      const nameParam = c.req.query('name')

      const costs = costParam ? costParam.split(',').map(Number).filter(n => !Number.isNaN(n)) : undefined
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

      if (costs && costs.some(c => c < 1 || c > 5)) {
        return c.json({
          success: false,
          message: 'Invalid cost values. Must be between 1 and 5',
        }, 400)
      }

      // 查询数据
      const result = await championService.queryChampions({
        page,
        pageSize,
        costs,
        names,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      })

      // 判断是否分页
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
        message: 'Failed to query champions',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 500)
    }
  }
}

export const championController = new ChampionController()
