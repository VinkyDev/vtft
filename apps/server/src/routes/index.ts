import { OpenAPIHono } from '@hono/zod-openapi'
import { cacheMiddleware } from '../middleware'
import augmentRoutes from './augment'
import cacheRoutes from './cache'
import championRoutes from './champion'
import compRoutes from './comp'
import itemRoutes from './item'
import lookupsRoutes from './lookups'
import schedulerRoutes from './scheduler'
import seasonsRoutes from './seasons'
import unitItemsRoutes from './unit_items'

const apiRoutes = new OpenAPIHono()

apiRoutes.use('*', cacheMiddleware())

// 挂载各个路由模块
apiRoutes.route('/units', championRoutes)
apiRoutes.route('/items', itemRoutes)
apiRoutes.route('/unit-items', unitItemsRoutes)
apiRoutes.route('/augments', augmentRoutes)
apiRoutes.route('/comps', compRoutes)
apiRoutes.route('/scheduler', schedulerRoutes)
apiRoutes.route('/cache', cacheRoutes)
apiRoutes.route('/seasons', seasonsRoutes)
apiRoutes.route('/lookups', lookupsRoutes)

export default apiRoutes
