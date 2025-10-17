# TFT API 文档

基于 Hono 的云顶之弈数据 API 服务。

## 项目结构

```
apps/api/
├── src/
│   ├── controllers/     # 控制器层（请求/响应处理）
│   │   ├── champion.ts
│   │   ├── item.ts
│   │   ├── augment.ts
│   │   ├── comp.ts
│   │   └── index.ts
│   ├── services/        # 服务层（业务逻辑）
│   │   ├── database.ts
│   │   ├── champion.ts
│   │   ├── item.ts
│   │   ├── augment.ts
│   │   ├── comp.ts
│   │   └── index.ts
│   ├── routes/          # 路由层（端点定义）
│   │   ├── champion.ts
│   │   ├── item.ts
│   │   ├── augment.ts
│   │   ├── comp.ts
│   │   └── index.ts
│   ├── middleware/      # 中间件
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── index.ts
│   └── index.ts         # 入口文件
├── package.json
└── tsconfig.json
```

## 架构设计

### 分层架构

**Routes → Controllers → Services → Database**

- **Routes**：定义 API 端点，映射 HTTP 请求到控制器方法
- **Controllers**：处理请求参数验证、调用服务层、返回响应
- **Services**：业务逻辑层，调用数据库仓储
- **Database**：数据访问层（来自 `db` 包）

### 优点

- **解耦**：各层职责清晰，易于维护和测试
- **可扩展**：新增功能只需在相应层添加代码
- **可重用**：服务层可被不同控制器或路由复用
- **类型安全**：全栈 TypeScript，共享类型定义

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 配置数据库

创建 `.env` 文件（或使用默认配置）：

```env
MONGODB_URI=mongodb://root:5fptlnt5@dbconn.sealosgzg.site:42829/?directConnection=true
MONGODB_DB_NAME=vtft
PORT=3000
```

### 启动服务

```bash
# 开发模式（热重载）
pnpm --filter api dev

# 生产模式
pnpm --filter api build
pnpm --filter api start
```

服务默认运行在 `http://localhost:3000`

## API 端点

### 基础端点

#### GET /

获取 API 信息

**响应示例：**

```json
{
  "success": true,
  "message": "TFT API Server",
  "version": "1.0.0",
  "endpoints": {
    "champions": "/api/champions",
    "items": "/api/items",
    "augments": "/api/augments",
    "comps": "/api/comps"
  }
}
```

#### GET /health

健康检查

**响应示例：**

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-10-15T08:00:00.000Z",
  "database": "connected"
}
```

### 英雄 API (Champions)

#### GET /api/champions

获取所有英雄

**响应示例：**

```json
{
  "success": true,
  "data": [...],
  "count": 58
}
```

#### GET /api/champions/top?limit=10

获取排名前 N 的英雄

**查询参数：**

- `limit`：返回数量，默认 10，范围 1-100

#### GET /api/champions/cost/:cost

按费用查询英雄

**路径参数：**

- `cost`：英雄费用，范围 1-5

**示例：** `GET /api/champions/cost/5`

#### GET /api/champions/:name

按名称查询英雄

**路径参数：**

- `name`：英雄名称（如：李青）

**示例：** `GET /api/champions/李青`

### 装备 API (Items)

#### GET /api/items

获取所有装备

#### GET /api/items/top?limit=10

获取排名前 N 的装备

**查询参数：**

- `limit`：返回数量，默认 10，范围 1-100

#### GET /api/items/champion/:champion

按推荐英雄查询装备

**路径参数：**

- `champion`：英雄名称

**示例：** `GET /api/items/champion/李青`

#### GET /api/items/:name

按名称查询装备

**路径参数：**

- `name`：装备名称（如：石像鬼石板甲）

### 强化符文 API (Augments)

#### GET /api/augments

获取所有强化符文

#### GET /api/augments/top?limit=10

获取排名前 N 的强化符文

**查询参数：**

- `limit`：返回数量，默认 10，范围 1-100

#### GET /api/augments/level/:level

按级别查询强化符文

**路径参数：**

- `level`：级别，可选值：`Silver`、`Gold`、`Prismatic`

**示例：** `GET /api/augments/level/Gold`

#### GET /api/augments/tier/:tier

按段位查询强化符文

**路径参数：**

- `tier`：段位（如：S、A、B）

#### GET /api/augments/:name

按名称查询强化符文

### 阵容 API (Comps)

#### GET /api/comps?skip=0&limit=20

获取所有阵容（分页）

**查询参数：**

- `skip`：跳过数量，默认 0
- `limit`：返回数量，默认 20，范围 1-100

**响应示例：**

```json
{
  "success": true,
  "data": [...],
  "count": 20,
  "pagination": {
    "skip": 0,
    "limit": 20
  }
}
```

#### GET /api/comps/popular?limit=10

获取热门阵容（按挑选率）

**查询参数：**

- `limit`：返回数量，默认 10，范围 1-100

#### GET /api/comps/high-win-rate?limit=10

获取高胜率阵容

**查询参数：**

- `limit`：返回数量，默认 10，范围 1-100

#### GET /api/comps/tier/:tier

按段位查询阵容

**路径参数：**

- `tier`：段位（如：S、A、B）

#### GET /api/comps/level-type/:levelType

按类型查询阵容

**路径参数：**

- `levelType`：阵容类型（如：standard、reroll、fast8）

#### GET /api/comps/name/:name

按名称查询阵容

**路径参数：**

- `name`：阵容名称

#### GET /api/comps/:compId

按 ID 查询阵容（不含详情）

**路径参数：**

- `compId`：阵容 ID

**响应示例：**

```json
{
  "success": true,
  "data": {
    "compId": "超级战队_default_standard",
    "rank": 1,
    "name": "超级战队",
    "tier": "S",
    "avgPlace": 3.85,
    "top4Rate": 65.2,
    "pickRate": 12.5,
    "traits": [...],
    "champions": [...]
  }
}
```

#### GET /api/comps/:compId/details

获取阵容详情（大数据，单独接口）

**路径参数：**

- `compId`：阵容 ID

**响应示例：**

```json
{
  "success": true,
  "data": {
    "earlyGame": {...},
    "midGame": {...},
    "lateGame": {...},
    "positioning": {...},
    "items": {...},
    "augments": {...}
  }
}
```

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": {...},
  "count": 10  // 可选，列表接口包含
}
```

### 错误响应

```json
{
  "success": false,
  "message": "错误描述"
}
```

开发环境下会额外返回：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息",
  "stack": "错误堆栈"
}
```

## HTTP 状态码

- `200`：成功
- `400`：请求参数错误
- `404`：资源不存在
- `500`：服务器内部错误

## 中间件

### requestLogger

记录所有请求的方法、路径、状态码和耗时

### cors

启用跨域资源共享（CORS）

### errorHandler

统一错误处理，捕获所有未处理的异常

## 优雅关闭

服务支持优雅关闭，在接收到 `SIGINT` 或 `SIGTERM` 信号时：

1. 断开数据库连接
2. 等待所有请求完成
3. 退出进程

按 `Ctrl+C` 或 `kill` 命令会触发优雅关闭。

## 开发建议

### 添加新的 API 端点

1. **在 `services/` 中添加业务逻辑**

   ```typescript
   export class NewService {
     async getData() {
       const db = databaseService.getTFTDatabase()
       return await db.collection.find().toArray()
     }
   }
   ```

2. **在 `controllers/` 中添加控制器**

   ```typescript
   export class NewController {
     async get(c: Context) {
       const data = await newService.getData()
       return c.json({ success: true, data })
     }
   }
   ```

3. **在 `routes/` 中添加路由**

   ```typescript
   const routes = new Hono()
   routes.get('/', c => newController.get(c))
   export default routes
   ```

4. **在 `routes/index.ts` 中注册**
   ```typescript
   apiRoutes.route('/new', newRoutes)
   ```

### 类型检查和 Lint

```bash
# 类型检查
pnpm --filter api typecheck

# Lint 检查（自动修复）
pnpm --filter api lint
```

## 注意事项

1. **数据库连接**：服务启动时会自动连接数据库，确保 MongoDB 可用
2. **错误处理**：所有异常由 errorHandler 中间件统一处理
3. **参数验证**：控制器层负责验证请求参数
4. **数据分离**：阵容详情单独接口，避免列表查询加载大量数据
5. **类型安全**：使用 `types` 包中的共享类型定义

## 性能优化

- 使用 MongoDB 索引加速查询
- 阵容数据分离存储（comps 和 comp_details）
- 分页查询避免一次性加载大量数据
- 数据库连接池复用

## 后续扩展

- [ ] 添加缓存层（Redis）
- [ ] 添加 API 限流
- [ ] 添加用户认证
- [ ] 添加数据统计和分析接口
- [ ] 添加 GraphQL 支持
- [ ] 添加 WebSocket 实时更新
