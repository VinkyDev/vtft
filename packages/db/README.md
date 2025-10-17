# db

MongoDB 数据库连接管理包

## 功能特性

- 单例模式的 MongoDB 客户端管理
- 自动连接池管理
- 支持环境变量和直接配置
- TypeScript 类型支持
- 连接状态监控

## 安装

```bash
pnpm add db --filter <your-workspace>
```

## 快速开始

### 基础用法

```typescript
import { getMongoClient } from 'db'

// 获取 MongoDB 客户端（使用默认配置）
const mongo = getMongoClient()

// 连接到数据库
await mongo.connect()

// 获取数据库实例
const db = mongo.getDb()

// 使用数据库
const users = db.collection('users')
const user = await users.findOne({ email: 'test@example.com' })

// 断开连接
await mongo.disconnect()
```

### 自定义配置

```typescript
import { getMongoClient } from 'db'

const mongo = getMongoClient({
  uri: 'mongodb://localhost:27017',
  dbName: 'myapp',
  options: {
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  },
})

await mongo.connect()
```

### 环境变量配置

创建 `.env` 文件：

```env
MONGODB_URI=mongodb://root:5fptlnt5@dbconn.sealosgzg.site:42829/?directConnection=true
MONGODB_DB_NAME=vtft
```

代码中使用：

```typescript
import { getMongoClient } from 'db'

// 自动读取环境变量
const mongo = getMongoClient()
await mongo.connect()
```

## API

### getMongoClient(config?)

获取 MongoDB 客户端单例实例。

**参数：**

- `config?: MongoDBConfig` - 可选配置对象

**返回：**

- `MongoDBManager` - MongoDB 管理器实例

### MongoDBManager

#### connect()

连接到 MongoDB 数据库。

```typescript
await mongo.connect()
```

#### disconnect()

断开 MongoDB 连接。

```typescript
await mongo.disconnect()
```

#### getDb(name?)

获取数据库实例。

**参数：**

- `name?: string` - 可选的数据库名称，如果不提供则使用配置中的默认数据库

**返回：**

- `Db` - MongoDB 数据库实例

```typescript
const db = mongo.getDb()
const customDb = mongo.getDb('another-database')
```

#### isConnected()

检查是否已连接。

**返回：**

- `boolean` - 连接状态

```typescript
if (mongo.isConnected()) {
  console.log('MongoDB is connected')
}
```

#### getClient()

获取原生 MongoDB 客户端。

**返回：**

- `MongoClient | null` - MongoDB 客户端实例

```typescript
const client = mongo.getClient()
```

## 类型定义

### MongoDBConfig

```typescript
interface MongoDBConfig {
  uri?: string
  dbName?: string
  options?: {
    maxPoolSize?: number
    minPoolSize?: number
    maxIdleTimeMS?: number
    connectTimeoutMS?: number
    socketTimeoutMS?: number
  }
}
```

## 默认配置

- **URI**: `mongodb://root:5fptlnt5@dbconn.sealosgzg.site:42829/?directConnection=true`
- **数据库名**: `vtft`
- **最大连接池大小**: 10
- **最小连接池大小**: 2
- **最大空闲时间**: 60000ms
- **连接超时**: 10000ms
- **Socket 超时**: 45000ms

## 最佳实践

1. **在应用启动时连接**

```typescript
// app.ts
import { getMongoClient } from 'db'

const mongo = getMongoClient()

async function bootstrap() {
  try {
    await mongo.connect()
    console.log('Database connected')
    // 启动应用
  }
  catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
}

bootstrap()
```

2. **在应用关闭时断开连接**

```typescript
process.on('SIGINT', async () => {
  await mongo.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await mongo.disconnect()
  process.exit(0)
})
```

3. **使用环境变量管理敏感信息**

不要在代码中硬编码数据库连接字符串，使用环境变量。

## 示例

### 完整的应用示例

```typescript
import { getMongoClient } from 'db'

async function main() {
  const mongo = getMongoClient()

  try {
    // 连接数据库
    await mongo.connect()

    // 获取数据库实例
    const db = mongo.getDb()

    // 操作集合
    const users = db.collection('users')

    // 插入数据
    await users.insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    })

    // 查询数据
    const user = await users.findOne({ email: 'john@example.com' })
    console.log('User:', user)

    // 更新数据
    await users.updateOne(
      { email: 'john@example.com' },
      { $set: { updatedAt: new Date() } },
    )

    // 删除数据
    await users.deleteOne({ email: 'john@example.com' })
  }
  catch (error) {
    console.error('Database operation failed:', error)
  }
  finally {
    // 断开连接
    await mongo.disconnect()
  }
}

main()
```

## 注意事项

- 使用单例模式，整个应用共享一个 MongoDB 客户端实例
- 连接池会自动管理，无需手动创建多个连接
- 在生产环境中务必使用环境变量管理敏感信息
- 确保在应用关闭时正确断开数据库连接
