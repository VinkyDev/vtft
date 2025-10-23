/**
 * OpenAPI 3.0 配置
 */
export const openapiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'TFT API',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/',
    },
  ],
  tags: [
    {
      name: 'Champions',
      description: '英雄数据查询',
    },
    {
      name: 'Items',
      description: '装备数据查询',
    },
    {
      name: 'Augments',
      description: '强化符文数据查询',
    },
    {
      name: 'Comps',
      description: '阵容数据查询',
    },
    {
      name: 'Scheduler',
      description: '爬虫定时任务管理',
    },
  ],
  paths: {
    '/api/champions': {
      get: {
        tags: ['Champions'],
        summary: '查询英雄',
        description: `统一的英雄查询接口，支持多条件筛选、排序和分页。`,
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码（从1开始），-1表示不分页',
            schema: { type: 'integer', default: -1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页数量，-1表示不分页',
            schema: { type: 'integer', default: -1 },
          },
          {
            name: 'cost',
            in: 'query',
            description: '费用筛选，支持逗号分隔（如: 1,2,3）',
            schema: { type: 'string' },
          },
          {
            name: 'name',
            in: 'query',
            description: '名称筛选，支持逗号分隔',
            schema: { type: 'string' },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: '排序字段',
            schema: {
              type: 'string',
              enum: ['rank', 'cost', 'avgPlace', 'top4Rate', 'firstPlaceRate'],
              default: 'rank',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: '排序方向',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          200: {
            description: '成功返回英雄列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Champion' },
                    },
                    count: { type: 'integer', description: '当前返回的数据数量' },
                    total: { type: 'integer', description: '符合条件的总数据量' },
                    pagination: {
                      type: 'object',
                      description: '分页信息（仅在分页时返回）',
                      properties: {
                        page: { type: 'integer' },
                        pageSize: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: '参数错误',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/items': {
      get: {
        tags: ['Items'],
        summary: '查询装备',
        description: `统一的装备查询接口，支持多条件筛选、排序和分页。`,
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码（从1开始），-1表示不分页',
            schema: { type: 'integer', default: -1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页数量，-1表示不分页',
            schema: { type: 'integer', default: -1, maximum: 100 },
          },
          {
            name: 'name',
            in: 'query',
            description: '名称筛选，支持逗号分隔',
            schema: { type: 'string' },
          },
          {
            name: 'champion',
            in: 'query',
            description: '推荐英雄筛选',
            schema: { type: 'string' },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: '排序字段',
            schema: {
              type: 'string',
              enum: ['rank', 'avgPlace', 'top4Rate', 'firstPlaceRate'],
              default: 'rank',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: '排序方向',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          200: {
            description: '成功返回装备列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Item' },
                    },
                    count: { type: 'integer' },
                    total: { type: 'integer' },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          400: {
            description: '参数错误',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/augments': {
      get: {
        tags: ['Augments'],
        summary: '查询强化符文',
        description: `统一的强化符文查询接口，支持多条件筛选、排序和分页。`,
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码（从1开始），-1表示不分页',
            schema: { type: 'integer', default: -1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页数量，-1表示不分页',
            schema: { type: 'integer', default: -1, maximum: 100 },
          },
          {
            name: 'name',
            in: 'query',
            description: '名称筛选，支持逗号分隔',
            schema: { type: 'string' },
          },
          {
            name: 'level',
            in: 'query',
            description: '级别筛选，支持逗号分隔',
            schema: {
              type: 'string',
              enum: ['Silver', 'Gold', 'Prismatic'],
            },
          },
          {
            name: 'tier',
            in: 'query',
            description: '段位筛选，支持逗号分隔',
            schema: { type: 'string', enum: ['S', 'A', 'B', 'C', 'D'] },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: '排序字段',
            schema: {
              type: 'string',
              enum: ['rank', 'avgPlace', 'top4Rate', 'firstPlaceRate'],
              default: 'rank',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: '排序方向',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          200: {
            description: '成功返回强化符文列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Augment' },
                    },
                    count: { type: 'integer' },
                    total: { type: 'integer' },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          400: {
            description: '参数错误',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/comps': {
      get: {
        tags: ['Comps'],
        summary: '查询阵容',
        description: `统一的阵容查询接口，支持多条件筛选、排序和分页。`,
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码（从1开始），-1表示不分页',
            schema: { type: 'integer', default: -1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: '每页数量，-1表示不分页',
            schema: { type: 'integer', default: -1, maximum: 100 },
          },
          {
            name: 'name',
            in: 'query',
            description: '名称筛选（模糊匹配）',
            schema: { type: 'string' },
          },
          {
            name: 'tier',
            in: 'query',
            description: '段位筛选',
            schema: { type: 'string' },
          },
          {
            name: 'levelType',
            in: 'query',
            description: '类型筛选',
            schema: { type: 'string' },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: '排序字段',
            schema: {
              type: 'string',
              enum: ['rank', 'pickRate', 'firstPlaceRate', 'avgPlace', 'top4Rate'],
              default: 'rank',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: '排序方向',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
        ],
        responses: {
          200: {
            description: '成功返回阵容列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Comp' },
                    },
                    count: { type: 'integer' },
                    total: { type: 'integer' },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          400: {
            description: '参数错误',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/comps/{compId}': {
      get: {
        tags: ['Comps'],
        summary: '获取单个阵容',
        description: `根据 compId 获取阵容信息。`,
        parameters: [
          {
            name: 'compId',
            in: 'path',
            required: true,
            description: '阵容ID',
            schema: { type: 'string' },
          },
          {
            name: 'includeDetails',
            in: 'query',
            description: '是否包含详细信息',
            schema: { type: 'boolean', default: false },
          },
        ],
        responses: {
          200: {
            description: '成功返回阵容信息',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      oneOf: [
                        { $ref: '#/components/schemas/Comp' },
                        { $ref: '#/components/schemas/CompWithDetails' },
                      ],
                    },
                  },
                },
              },
            },
          },
          404: {
            description: '阵容不存在',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/scheduler/status': {
      get: {
        tags: ['Scheduler'],
        summary: '获取定时任务状态',
        description: '查看所有爬虫定时任务的运行状态、调度时间等信息',
        responses: {
          200: {
            description: '成功返回定时任务状态',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SchedulerStatusResponse' },
              },
            },
          },
        },
      },
    },
    '/api/scheduler/trigger/{taskName}': {
      post: {
        tags: ['Scheduler'],
        summary: '手动触发爬虫任务',
        description: '立即执行指定的爬虫任务，无需等待定时调度。任务将在后台异步执行。',
        parameters: [
          {
            name: 'taskName',
            in: 'path',
            required: true,
            description: '任务名称',
            schema: {
              type: 'string',
              enum: ['crawler:champions', 'crawler:items', 'crawler:augments', 'crawler:comps'],
              example: 'crawler:champions',
            },
          },
        ],
        responses: {
          200: {
            description: '任务触发响应',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TriggerTaskResponse' },
              },
            },
          },
          400: {
            description: '任务名称无效或任务不存在',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Champion: {
        type: 'object',
        properties: {
          rank: { type: 'integer', description: '排名' },
          name: { type: 'string', description: '名称' },
          icon: { type: 'string', description: '图标URL' },
          traits: {
            type: 'array',
            items: { type: 'string' },
            description: '羁绊',
          },
          cost: { type: 'integer', description: '费用' },
          avgPlace: { type: 'number', description: '平均排名' },
          top4Rate: { type: 'number', description: '前四率' },
          firstPlaceRate: { type: 'number', description: '吃鸡率' },
          matches: { type: 'integer', description: '对局数' },
        },
      },
      Item: {
        type: 'object',
        properties: {
          rank: { type: 'integer' },
          name: { type: 'string' },
          icon: { type: 'string' },
          components: {
            type: 'array',
            items: { type: 'string' },
            description: '合成材料',
          },
          avgPlace: { type: 'number' },
          top4Rate: { type: 'number' },
          firstPlaceRate: { type: 'number' },
          matches: { type: 'integer' },
          recommendedFor: {
            type: 'array',
            items: { type: 'string' },
            description: '推荐英雄',
          },
        },
      },
      Augment: {
        type: 'object',
        properties: {
          rank: { type: 'integer' },
          name: { type: 'string' },
          icon: { type: 'string' },
          level: {
            type: 'string',
            enum: ['Silver', 'Gold', 'Prismatic'],
            description: '级别',
          },
          tier: { type: 'string', description: '段位' },
          avgPlace: { type: 'number' },
          top4Rate: { type: 'number' },
          firstPlaceRate: { type: 'number' },
          matches: { type: 'integer' },
        },
      },
      Comp: {
        type: 'object',
        properties: {
          compId: { type: 'string', description: '阵容ID' },
          rank: { type: 'integer' },
          name: { type: 'string' },
          tier: { type: 'string' },
          level: { type: 'integer' },
          levelType: { type: 'string' },
          avgPlace: { type: 'number' },
          firstPlaceRate: { type: 'number' },
          top4Rate: { type: 'number' },
          pickRate: { type: 'number', description: '挑选率' },
          traits: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                icon: { type: 'string' },
                activeLevel: { type: 'integer' },
                maxLevel: { type: 'integer' },
              },
            },
          },
          champions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                icon: { type: 'string' },
                cost: { type: 'integer' },
                level: { type: 'integer' },
                items: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      },
      CompWithDetails: {
        type: 'object',
        description: '包含详细信息的阵容',
        allOf: [
          { $ref: '#/components/schemas/Comp' },
          {
            type: 'object',
            properties: {
              details: {
                type: 'object',
                description: '详细信息（装备、增强等）',
              },
            },
          },
        ],
      },
      Pagination: {
        type: 'object',
        description: '分页信息',
        properties: {
          page: { type: 'integer', description: '当前页码' },
          pageSize: { type: 'integer', description: '每页数量' },
          totalPages: { type: 'integer', description: '总页数' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', description: '错误信息' },
          error: { type: 'string', description: '错误详情（可选）' },
        },
      },
      SchedulerTask: {
        type: 'object',
        description: '定时任务信息',
        properties: {
          name: {
            type: 'string',
            description: '任务名称',
            example: 'crawler:champions',
          },
          running: {
            type: 'boolean',
            description: '是否正在运行',
          },
          schedule: {
            type: 'string',
            description: 'Cron 表达式',
            example: '0 2 * * *',
          },
          enabled: {
            type: 'boolean',
            description: '是否已启用',
          },
        },
      },
      SchedulerStatusResponse: {
        type: 'object',
        description: '定时任务状态响应',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          tasks: {
            type: 'array',
            description: '任务列表',
            items: { $ref: '#/components/schemas/SchedulerTask' },
          },
        },
      },
      TriggerTaskResponse: {
        type: 'object',
        description: '触发任务响应',
        properties: {
          success: {
            type: 'boolean',
            description: '是否成功触发',
          },
          message: {
            type: 'string',
            description: '响应消息',
            example: '任务 crawler:champions 已触发执行',
          },
        },
      },
    },
  },
}
