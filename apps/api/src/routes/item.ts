import { Hono } from 'hono'
import { itemController } from '../controllers'

const itemRoutes = new Hono()

// GET /api/items - 装备查询接口
itemRoutes.get('/', c => itemController.query(c))

export default itemRoutes
