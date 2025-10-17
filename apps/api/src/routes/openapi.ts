import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'
import {
  AugmentSchema,
  ChampionSchema,
  CompDetailsSchema,
  CompListResponseSchema,
  CompSchema,
  ErrorResponseSchema,
  ItemSchema,
  SuccessListResponseSchema,
  SuccessResponseSchema,
} from '../schemas'

// 英雄路由定义
export const getAllChampionsRoute = createRoute({
  method: 'get',
  path: '/api/champions',
  tags: ['Champions'],
  summary: '获取所有英雄',
  description: '返回所有英雄的列表',
  responses: {
    200: {
      description: '成功返回英雄列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ChampionSchema),
        },
      },
    },
  },
})

export const getTopChampionsRoute = createRoute({
  method: 'get',
  path: '/api/champions/top',
  tags: ['Champions'],
  summary: '获取排名前N的英雄',
  request: {
    query: z.object({
      limit: z.string().optional().openapi({ example: '10' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回排名前N的英雄',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ChampionSchema),
        },
      },
    },
    400: {
      description: '参数错误',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

export const getChampionByCostRoute = createRoute({
  method: 'get',
  path: '/api/champions/cost/{cost}',
  tags: ['Champions'],
  summary: '按费用查询英雄',
  request: {
    params: z.object({
      cost: z.string().openapi({ example: '5' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回指定费用的英雄',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ChampionSchema),
        },
      },
    },
    400: {
      description: '参数错误',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

export const getChampionByNameRoute = createRoute({
  method: 'get',
  path: '/api/champions/{name}',
  tags: ['Champions'],
  summary: '按名称查询英雄',
  request: {
    params: z.object({
      name: z.string().openapi({ example: '李青' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回英雄信息',
      content: {
        'application/json': {
          schema: SuccessResponseSchema(ChampionSchema),
        },
      },
    },
    404: {
      description: '英雄不存在',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

// 装备路由定义
export const getAllItemsRoute = createRoute({
  method: 'get',
  path: '/api/items',
  tags: ['Items'],
  summary: '获取所有装备',
  responses: {
    200: {
      description: '成功返回装备列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ItemSchema),
        },
      },
    },
  },
})

export const getTopItemsRoute = createRoute({
  method: 'get',
  path: '/api/items/top',
  tags: ['Items'],
  summary: '获取排名前N的装备',
  request: {
    query: z.object({
      limit: z.string().optional().openapi({ example: '10' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回排名前N的装备',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ItemSchema),
        },
      },
    },
  },
})

export const getItemsByChampionRoute = createRoute({
  method: 'get',
  path: '/api/items/champion/{champion}',
  tags: ['Items'],
  summary: '按推荐英雄查询装备',
  request: {
    params: z.object({
      champion: z.string().openapi({ example: '李青' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回装备列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(ItemSchema),
        },
      },
    },
  },
})

export const getItemByNameRoute = createRoute({
  method: 'get',
  path: '/api/items/{name}',
  tags: ['Items'],
  summary: '按名称查询装备',
  request: {
    params: z.object({
      name: z.string().openapi({ example: '石像鬼石板甲' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回装备信息',
      content: {
        'application/json': {
          schema: SuccessResponseSchema(ItemSchema),
        },
      },
    },
    404: {
      description: '装备不存在',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

// 强化符文路由定义
export const getAllAugmentsRoute = createRoute({
  method: 'get',
  path: '/api/augments',
  tags: ['Augments'],
  summary: '获取所有强化符文',
  responses: {
    200: {
      description: '成功返回强化符文列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(AugmentSchema),
        },
      },
    },
  },
})

export const getTopAugmentsRoute = createRoute({
  method: 'get',
  path: '/api/augments/top',
  tags: ['Augments'],
  summary: '获取排名前N的强化符文',
  request: {
    query: z.object({
      limit: z.string().optional().openapi({ example: '10' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回排名前N的强化符文',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(AugmentSchema),
        },
      },
    },
  },
})

export const getAugmentsByLevelRoute = createRoute({
  method: 'get',
  path: '/api/augments/level/{level}',
  tags: ['Augments'],
  summary: '按级别查询强化符文',
  request: {
    params: z.object({
      level: z.enum(['Silver', 'Gold', 'Prismatic']).openapi({ example: 'Gold' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回强化符文列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(AugmentSchema),
        },
      },
    },
    400: {
      description: '参数错误',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

export const getAugmentsByTierRoute = createRoute({
  method: 'get',
  path: '/api/augments/tier/{tier}',
  tags: ['Augments'],
  summary: '按段位查询强化符文',
  request: {
    params: z.object({
      tier: z.string().openapi({ example: 'S' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回强化符文列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(AugmentSchema),
        },
      },
    },
  },
})

export const getAugmentByNameRoute = createRoute({
  method: 'get',
  path: '/api/augments/{name}',
  tags: ['Augments'],
  summary: '按名称查询强化符文',
  request: {
    params: z.object({
      name: z.string().openapi({ example: '战斗法师' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回强化符文信息',
      content: {
        'application/json': {
          schema: SuccessResponseSchema(AugmentSchema),
        },
      },
    },
    404: {
      description: '强化符文不存在',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

// 阵容路由定义
export const getAllCompsRoute = createRoute({
  method: 'get',
  path: '/api/comps',
  tags: ['Comps'],
  summary: '获取所有阵容（分页）',
  request: {
    query: z.object({
      skip: z.string().optional().openapi({ example: '0' }),
      limit: z.string().optional().openapi({ example: '20' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: CompListResponseSchema,
        },
      },
    },
  },
})

export const getPopularCompsRoute = createRoute({
  method: 'get',
  path: '/api/comps/popular',
  tags: ['Comps'],
  summary: '获取热门阵容',
  request: {
    query: z.object({
      limit: z.string().optional().openapi({ example: '10' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回热门阵容',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(CompSchema),
        },
      },
    },
  },
})

export const getHighWinRateCompsRoute = createRoute({
  method: 'get',
  path: '/api/comps/high-win-rate',
  tags: ['Comps'],
  summary: '获取高胜率阵容',
  request: {
    query: z.object({
      limit: z.string().optional().openapi({ example: '10' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回高胜率阵容',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(CompSchema),
        },
      },
    },
  },
})

export const getCompsByTierRoute = createRoute({
  method: 'get',
  path: '/api/comps/tier/{tier}',
  tags: ['Comps'],
  summary: '按段位查询阵容',
  request: {
    params: z.object({
      tier: z.string().openapi({ example: 'S' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(CompSchema),
        },
      },
    },
  },
})

export const getCompsByLevelTypeRoute = createRoute({
  method: 'get',
  path: '/api/comps/level-type/{levelType}',
  tags: ['Comps'],
  summary: '按类型查询阵容',
  request: {
    params: z.object({
      levelType: z.string().openapi({ example: 'standard' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(CompSchema),
        },
      },
    },
  },
})

export const getCompsByNameRoute = createRoute({
  method: 'get',
  path: '/api/comps/name/{name}',
  tags: ['Comps'],
  summary: '按名称查询阵容',
  request: {
    params: z.object({
      name: z.string().openapi({ example: '超级战队' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: SuccessListResponseSchema(CompSchema),
        },
      },
    },
  },
})

export const getCompByIdRoute = createRoute({
  method: 'get',
  path: '/api/comps/{compId}',
  tags: ['Comps'],
  summary: '按ID查询阵容（不含详情）',
  request: {
    params: z.object({
      compId: z.string().openapi({ example: 'comp_id_example' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容信息',
      content: {
        'application/json': {
          schema: SuccessResponseSchema(CompSchema),
        },
      },
    },
    404: {
      description: '阵容不存在',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})

export const getCompDetailsRoute = createRoute({
  method: 'get',
  path: '/api/comps/{compId}/details',
  tags: ['Comps'],
  summary: '获取阵容详情',
  request: {
    params: z.object({
      compId: z.string().openapi({ example: 'comp_id_example' }),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容详情',
      content: {
        'application/json': {
          schema: SuccessResponseSchema(CompDetailsSchema),
        },
      },
    },
    404: {
      description: '阵容详情不存在',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
    },
  },
})
