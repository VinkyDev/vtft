# Server Docker 部署指南

## 快速开始

### 1. 构建 Docker 镜像

```bash
# 在项目根目录执行
pnpm publish:server

# 或者指定镜像名称和标签
pnpm publish:server vtft-server latest
```

### 2. 运行容器

```bash
# 基础运行
docker run -p 3000:3000 --name vtft-server vtft-server:latest

# 后台运行
docker run -d -p 3000:3000 --name vtft-server vtft-server:latest

# 使用自定义环境变量
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e PORT=3000 \
  --name vtft-server \
  vtft-server:latest
```

### 3. 常用命令

```bash
# 查看日志
docker logs -f vtft-server

# 停止容器
docker stop vtft-server

# 启动已停止的容器
docker start vtft-server

# 删除容器
docker rm vtft-server

# 查看容器状态
docker ps -a | grep vtft-server
```

## 推送到 Docker Hub

```bash
# 1. 登录 Docker Hub
docker login

# 2. 标记镜像
docker tag vtft-server:latest <your-username>/vtft-server:latest

# 3. 推送镜像
docker push <your-username>/vtft-server:latest
```

## 使用 Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  vtft-server:
    image: vtft-server:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - PORT=3000
    restart: unless-stopped
```

运行:

```bash
docker-compose up -d
```

## 注意事项

1. **构建前提**: 确保已运行 `pnpm build:server` 构建了 dist 目录
2. **Playwright**: 镜像已包含 Chromium 浏览器及其依赖
3. **环境变量**: 可通过 `-e` 参数或 `docker-compose.yml` 配置环境变量
4. **数据持久化**: 如需持久化数据,使用 Docker volumes

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker logs vtft-server

# 进入容器调试
docker exec -it vtft-server sh
```

### 端口冲突

```bash
# 使用其他端口
docker run -p 8080:3000 --name vtft-server vtft-server:latest
```

### 检查镜像是否正确构建

```bash
# 查看镜像详情
docker images vtft-server

# 查看镜像历史
docker history vtft-server:latest
```
