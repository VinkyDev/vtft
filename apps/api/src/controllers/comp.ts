import type { Context } from 'hono'
import { compService } from '../services'

export class CompController {
  /**
   * 统一的阵容查询接口
   * 支持参数：
   * - page: 页码（从1开始，-1表示不分页，默认-1）
   * - pageSize: 每页数量（-1表示不分页，默认-1）
   * - name: 名称筛选
   * - tier: 段位筛选
   * - levelType: 类型筛选
   * - sortBy: 排序字段（rank/pickRate/firstPlaceRate/avgPlace，默认rank）
   * - sortOrder: 排序方向（asc/desc，默认asc）
   */
  async query(c: Context) {
    try {
      const page = Number(c.req.query('page') ?? '-1')
      const pageSize = Number(c.req.query('pageSize') ?? '-1')
      const sortBy = c.req.query('sortBy') || 'rank'
      const sortOrder = c.req.query('sortOrder') || 'asc'
      const name = c.req.query('name')
      const tier = c.req.query('tier')
      const levelType = c.req.query('levelType')

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

      const result = await compService.queryComps({
        page,
        pageSize,
        name,
        tier,
        levelType,
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
        message: 'Failed to query comps',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 500)
    }
  }

  /**
   * 按 ID 获取阵容
   * 支持参数：
   * - includeDetails: 是否包含详情（true/false）
   */
  async getById(c: Context) {
    try {
      const compId = c.req.param('compId')
      const includeDetails = c.req.query('includeDetails') === 'true'

      if (includeDetails) {
        const details = await compService.getCompDetails(compId)
        if (!details) {
          return c.json({
            success: false,
            message: `Details for comp '${compId}' not found`,
          }, 404)
        }
        return c.json({
          success: true,
          data: details,
        })
      }
      else {
        const comp = await compService.getCompByCompId(compId)
        if (!comp) {
          return c.json({
            success: false,
            message: `Comp '${compId}' not found`,
          }, 404)
        }
        return c.json({
          success: true,
          data: comp,
        })
      }
    }
    catch (error) {
      return c.json({
        success: false,
        message: 'Failed to fetch comp',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, 500)
    }
  }
}

export const compController = new CompController()
