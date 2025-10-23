import { Hono } from 'hono'
import { augmentController } from '../controllers'

const augmentRoutes = new Hono()

// GET /api/augments - 强化符文查询接口
augmentRoutes.get('/', c => augmentController.query(c))

export default augmentRoutes
