import { Hono } from 'hono'
import { championController } from '../controllers'

const championRoutes = new Hono()

// GET /api/champions - 英雄查询接口
championRoutes.get('/', c => championController.query(c))

export default championRoutes
