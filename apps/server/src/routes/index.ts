import { Hono } from 'hono'
import { cacheMiddleware } from '../middleware'
import augmentRoutes from './augment'
import cacheRoutes from './cache'
import championRoutes from './champion'
import compRoutes from './comp'
import itemRoutes from './item'
import schedulerRoutes from './scheduler'

const apiRoutes = new Hono()

apiRoutes.use('*', cacheMiddleware())

// 挂载各个路由模块
apiRoutes.route('/champions', championRoutes)
apiRoutes.route('/items', itemRoutes)
apiRoutes.route('/augments', augmentRoutes)
apiRoutes.route('/comps', compRoutes)
apiRoutes.route('/scheduler', schedulerRoutes)
apiRoutes.route('/cache', cacheRoutes)

export default apiRoutes
