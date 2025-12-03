#!/usr/bin/env node

/**
 * 准备 server 的 package.json 用于 Docker 构建
 * 1. 使用 pnpm deploy 部署 server 子包
 * 2. 移除 workspace 依赖（这些依赖已被 rslib 打包进 dist/index.js，无需在运行时安装）
 * 3. 替换 catalog 依赖为实际版本
 */

import { copyFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import {
  PROJECT_ROOT,
  exists,
  removeRecursive,
  readJSON,
  writeJSON,
  readText,
  exec,
  info,
  success,
  error,
  section,
} from './utils/index.mjs'

const SERVER_DIR = join(PROJECT_ROOT, 'apps/server')
const DEPLOY_DIR = join(SERVER_DIR, '.deploy')
const PACKAGE_JSON_PATH = join(SERVER_DIR, 'package.json')
const PACKAGE_JSON_BACKUP = join(SERVER_DIR, 'package.json.backup')

/**
 * 准备 package.json
 */
async function preparePackage() {
  await section('准备 Server Package', async () => {
    // 清理可能存在的旧 deploy 目录
    if (exists(DEPLOY_DIR)) {
      await removeRecursive(DEPLOY_DIR, { silent: true })
    }

    // 使用 pnpm deploy 部署 server 子包
    info('执行 pnpm deploy...')
    exec(`pnpm deploy --filter=server --prod --legacy ${DEPLOY_DIR}`, {
      cwd: PROJECT_ROOT,
    })
    success('✓ 部署完成')

    // 备份原始 package.json
    copyFileSync(PACKAGE_JSON_PATH, PACKAGE_JSON_BACKUP)

    // 从 deploy 目录读取并处理 package.json
    const deployPkg = join(DEPLOY_DIR, 'package.json')
    if (!exists(deployPkg)) {
      throw new Error('未找到部署后的 package.json')
    }

    // 读取 catalog 配置
    const workspaceYaml = await readText(join(PROJECT_ROOT, 'pnpm-workspace.yaml'))
    const catalog = {}
    const catalogMatch = workspaceYaml.match(/catalog:\s*([\s\S]*?)(?=\n\S|\n*$)/)
    if (catalogMatch) {
      const catalogContent = catalogMatch[1]
      const lines = catalogContent.split('\n').filter(line => line.trim())
      lines.forEach((line) => {
        const match = line.match(/^\s*['"]?([^:'"]+)['"]?\s*:\s*(.+)$/)
        if (match) {
          const [, key, value] = match
          catalog[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '')
        }
      })
    }

    // 读取并处理 package.json
    const pkg = await readJSON(deployPkg)

    // 移除所有 workspace 依赖
    let removedCount = 0
    const removedDeps = []

    for (const depType of ['dependencies', 'devDependencies']) {
      if (pkg[depType]) {
        for (const [name, version] of Object.entries(pkg[depType])) {
          if (version.startsWith('workspace:')) {
            delete pkg[depType][name]
            removedCount++
            removedDeps.push(name)
          }
        }
      }
    }

    // 替换 catalog: 依赖为实际版本
    let catalogCount = 0
    for (const depType of ['dependencies', 'devDependencies']) {
      if (pkg[depType]) {
        for (const dep of Object.keys(pkg[depType])) {
          if (pkg[depType][dep] === 'catalog:' && catalog[dep]) {
            pkg[depType][dep] = catalog[dep]
            catalogCount++
          }
        }
      }
    }

    // 写入处理后的 package.json
    await writeJSON(PACKAGE_JSON_PATH, pkg)
    if (removedCount > 0) {
      success(`移除 ${removedCount} 个 workspace 依赖: ${removedDeps.join(', ')}`)
    }
    success(`替换 ${catalogCount} 个 catalog 依赖`)
  })
}

/**
 * 恢复原始 package.json
 */
async function restorePackage() {
  await section('恢复 Package', async () => {
    if (exists(PACKAGE_JSON_BACKUP)) {
      copyFileSync(PACKAGE_JSON_BACKUP, PACKAGE_JSON_PATH)
      unlinkSync(PACKAGE_JSON_BACKUP)
      success('✓ 已恢复原始 package.json')
    }
    if (exists(DEPLOY_DIR)) {
      await removeRecursive(DEPLOY_DIR, { silent: true })
    }
  })
}

/**
 * 清理临时文件
 */
async function cleanup() {
  if (exists(DEPLOY_DIR)) {
    await removeRecursive(DEPLOY_DIR, { silent: true })
  }
  success('✓ 清理完成')
}

// 命令行接口
const command = process.argv[2]

async function main() {
  try {
    if (command === 'prepare') {
      await preparePackage()
    }
    else if (command === 'restore') {
      await restorePackage()
    }
    else if (command === 'cleanup') {
      await cleanup()
    }
    else {
      error('用法: node prepareServerPackage.mjs <command>')
      info('命令:')
      info('  prepare  - 准备 package.json')
      info('  restore  - 恢复原始 package.json')
      info('  cleanup  - 清理临时文件')
      process.exit(1)
    }
  }
  catch (err) {
    error(`执行失败: ${err.message}`)
    process.exit(1)
  }
}

main()
