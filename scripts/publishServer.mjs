#!/usr/bin/env node

import { join } from 'node:path'
import {
  PROJECT_ROOT,
  exists,
  exec as execUtil,
  info,
  success,
  error,
  warn,
  section,
} from './utils/index.mjs'

const SERVER_DIR = join(PROJECT_ROOT, 'apps/server')
const DIST_DIR = join(SERVER_DIR, 'dist')

/**
 * 执行命令（带错误处理和清理）
 */
function exec(command, options = {}) {
  try {
    execUtil(command, {
      cwd: SERVER_DIR,
      ...options,
    })
  }
  catch (err) {
    error(`\n❌ 命令执行失败: ${command}`)
    cleanup()
    process.exit(1)
  }
}

/**
 * 清理临时文件
 */
function cleanup() {
  try {
    execUtil('node scripts/prepareServerPackage.mjs restore', {
      cwd: PROJECT_ROOT,
      silent: true,
    })
  }
  catch {
    // 忽略清理错误
  }
}

/**
 * 主函数
 */
async function main() {
  // 获取命令行参数
  const args = process.argv.slice(2)
  const imageName = args[0] || 'vtft-server'
  const imageTag = args[1] || 'latest'
  const fullImageName = `${imageName}:${imageTag}`

  info('🚀 开始构建 Server Docker 镜像...')

  // 步骤 1: 检查 dist 目录
  await section('检查构建产物', async () => {
    if (!exists(DIST_DIR)) {
      warn('❌ 未找到 dist 目录,先构建 server...')
      exec('pnpm build', { cwd: SERVER_DIR })
    }
    else {
      success('✓ 已找到构建产物')
    }
  })

  // 步骤 2: 使用 prepareServerPackage 准备精简的 package.json
  await section('准备 package.json', async () => {
    try {
      execUtil('node scripts/prepareServerPackage.mjs prepare', {
        cwd: PROJECT_ROOT,
      })
    }
    catch (err) {
      error('❌ 准备文件失败')
      cleanup()
      process.exit(1)
    }
  })

  // 步骤 3: 构建 Docker 镜像
  await section(`构建 Docker 镜像 ${fullImageName}`, async () => {
    exec(`docker build -t ${fullImageName} .`)
  })

  // 清理临时文件
  await section('清理临时文件', async () => {
    cleanup()
  })

  // 步骤 4: 验证镜像
  await section('验证镜像', async () => {
    exec(`docker images ${imageName}`)
  })

  success('\n✨ Docker 镜像构建成功!')
  info(`\n镜像名称: ${fullImageName}`)
  warn('\n快速命令:')
  info(`  运行:   docker run -p 3000:3000 --name vtft-server --env-file apps/server/.env ${fullImageName}`)
  info('  停止:   docker stop vtft-server')
  info('  删除:   docker rm vtft-server')
  info('  日志:   docker logs -f vtft-server')
  warn('\n推送到 Docker Hub:')
  info(`  docker tag ${fullImageName} <your-username>/${imageName}:${imageTag}`)
  info(`  docker push <your-username>/${imageName}:${imageTag}`)
}

main().catch((err) => {
  error(`\n❌ 构建失败: ${err.message}`)
  cleanup()
  process.exit(1)
})
