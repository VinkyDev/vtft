import { Hono } from 'hono'
import augmentRoutes from './augment'
import championRoutes from './champion'
import compRoutes from './comp'
import itemRoutes from './item'

const apiRoutes = new Hono()

// 挂载各个路由模块
apiRoutes.route('/champions', championRoutes)
apiRoutes.route('/items', itemRoutes)
apiRoutes.route('/augments', augmentRoutes)
apiRoutes.route('/comps', compRoutes)

export default apiRoutes
