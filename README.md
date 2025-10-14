### v-monorepo 项目模板

现代化全栈开发模板，集成桌面端、Web端和API服务，采用monorepo架构管理。

## 🏗️ 项目架构

- **桌面端**: Electron + Vite + TypeScript
- **Web端**: React 19 + Vite + TypeScript
- **API服务**: Hono + Node.js + TypeScript
- **UI组件**: shadcn/ui + Tailwind CSS v4
- **包管理**: pnpm workspace
- **代码质量**: ESLint + 提交规范

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖
```bash
pnpm run setup
```

### 开发
```bash
pnpm dev:react      # React Web应用
pnpm dev:electron   # Electron桌面应用
pnpm dev:api        # API服务
```

## 📦 构建部署

```bash
# 构建桌面端应用
pnpm build:unpkg  # 通用构建
pnpm build:win      # Windows安装包
pnpm build:mac      # macOS安装包
pnpm build:linux    # Linux安装包
```

## 🔧 开发工具

```bash
# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
```

## 📄 许可证

MIT License
