### vtft


## 开发

### 🏗️ 项目架构

### 🚀 快速开始

#### 安装依赖

```bash
pnpm run setup
```

启动
```bash
pnpm dev:react      # React Web应用
pnpm dev:electron   # Electron桌面应用
pnpm dev:api        # API服务
```

### 📦 构建部署

```bash
pnpm build:unpack   # 通用构建（未打包）
pnpm build:win      # Windows 安装包
pnpm build:mac      # macOS 安装包
pnpm build:linux    # Linux 安装包
```

### Server 端部署

```bash
# 推送到 main 分支自动构建
git push origin main

# 或创建版本标签
git tag v1.0.0
git push origin v1.0.0
```
