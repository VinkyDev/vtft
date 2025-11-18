# VTFT

一个基于 React + Electron 的云顶之弈辅助应用，提供英雄、装备、羁绊、强化符文等数据的查询功能。

## 🏗️ 项目架构

```
vtft/
├── apps/
│   ├── react/             # Web 应用 (React 19 + Vite)
│   ├── electron/          # 桌面应用 (Electron 39)
│   └── server/            # API 服务器 (Hono + Node.js)
├── packages/
│   ├── bridge/            # Electron IPC 通信层
│   ├── crawler/           # Playwright 爬虫
│   ├── db/                # MongoDB 数据库层
│   ├── logger/            # 日志工具
│   ├── react-helper/      # React 工具库
│   ├── types/             # TypeScript 类型定义
│   ├── ui/                # UI 组件库
│   └── utils/             # 通用工具库
└── scripts/               # 构建脚本
```

### 技术栈

**前端**
- React 19 + React Compiler
- TailwindCSS + Shadcn UI

**桌面端**
- Electron 39

**服务端**
- Hono
- MongoDB
- Playwright

**构建工具**
- Vite 7 (Web)
- electron vite + electron-builder (Desktop)
- tsup (Server)
- rslib (Packages)

## 🚀 快速开始

### 安装依赖

```bash
# 首次安装（清理 + 安装依赖 + 构建包）
pnpm run setup

# 或仅安装依赖
pnpm install
```

### 开发模式

```bash
# 启动 Web 应用
pnpm dev:react

# 启动桌面应用 (electron-vite 开发服务器)
pnpm dev:electron

# 启动桌面应用 (electron-vite + React 开发服务器)
pnpm dev:desktop

# 启动服务
pnpm dev:server
```

### 环境变量配置


```env
# 服务端环境变量
MONGODB_URI=mongodb://localhost:27017/vtft # 数据库链接

# 桌面端环境变量
VITE_APTABASE_CODE=xxx # 用于 Aptabase 埋点
```

## 📦 构建部署

### 桌面应用构建

```bash
pnpm build:unpack
pnpm build:win
pnpm build:mac
pnpm build:linux
```

### Web 应用构建

```bash
pnpm build:react
```

构建产物位于 `apps/react/dist/` 目录。

### Server 端部署

#### 自动部署（Docker）

推送到 `main` 分支或创建版本标签会自动触发 GitHub Actions 构建并推送 Docker 镜像：

```bash
# 推送到 main 分支
git push origin main

# 或创建版本标签
git tag v1.0.0
git push origin v1.0.0
```

#### 部署

```bash
# 1. 构建
pnpm build:packages
pnpm build:server

# 2. 启动
cd apps/server
pnpm start
```

#### Docker 部署

```bash
# 拉取镜像
docker pull <your-dockerhub-username>/vtft-server:latest

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/vtft \
  --name vtft-server \
  <your-dockerhub-username>/vtft-server:latest
```
