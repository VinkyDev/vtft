import { Hono } from 'hono'
import { compController } from '../controllers'

const compRoutes = new Hono()

// GET /api/comps - 阵容查询接口
compRoutes.get('/', c => compController.query(c))

// GET /api/comps/:compId - 按ID查询阵容
// 支持参数: includeDetails (是否包含详情)
compRoutes.get('/:compId', c => compController.getById(c))

export default compRoutes
