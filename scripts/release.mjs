#!/usr/bin/env node

import { join, relative } from 'node:path'
import {
  PROJECT_ROOT,
  readJSON,
  writeJSON,
  getSubDirectories,
  exists,
  prompt,
  confirm,
  input,
  exec,
  getOutput,
  info,
  success,
  error,
  warn,
  newline,
  section,
} from './utils/index.mjs'

/**
 * 读取根目录 package.json 的当前版本
 */
async function getCurrentVersion() {
  const pkg = await readJSON(join(PROJECT_ROOT, 'package.json'))
  return pkg.version
}

/**
 * 解析版本号
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(-[\w.]+)?$/)
  if (!match) {
    throw new Error(`无效的版本号格式: ${version}`)
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
    prerelease: match[4] || '',
  }
}

/**
 * 生成新版本号
 */
function bumpVersion(currentVersion, type) {
  const { major, minor, patch } = parseVersion(currentVersion)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      throw new Error(`未知的版本类型: ${type}`)
  }
}

/**
 * 显示版本选择菜单并获取用户选择
 */
async function selectVersionType(currentVersion) {
  info(`当前版本: ${currentVersion}`)
  newline()
  info('请选择版本更新类型:')
  newline()
  info(`  1. Patch   (修订号) → ${bumpVersion(currentVersion, 'patch')} (bug 修复)`)
  info(`  2. Minor   (次版本) → ${bumpVersion(currentVersion, 'minor')} (新功能，向下兼容)`)
  info(`  3. Major   (主版本) → ${bumpVersion(currentVersion, 'major')} (重大更新，不兼容)`)
  info('  4. Custom  (自定义版本号)')
  info('  0. Cancel  (取消)')
  newline()

  const choice = await prompt('请输入选项 (1/2/3/4/0): ')

  switch (choice) {
    case '1':
      return bumpVersion(currentVersion, 'patch')
    case '2':
      return bumpVersion(currentVersion, 'minor')
    case '3':
      return bumpVersion(currentVersion, 'major')
    case '4': {
      const customVersion = await input(
        '请输入自定义版本号 (例如: 1.0.0-beta.1): ',
        (value) => {
          if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(value)) {
            return '版本号格式不正确，请使用 semver 格式，例如: 0.0.11 或 1.0.0-beta.1'
          }
          return true
        },
      )
      return customVersion
    }
    case '0':
      warn('\n✋ 已取消发布')
      process.exit(0)
    default:
      throw new Error('无效的选项，请输入 1, 2, 3, 4 或 0')
  }
}

/**
 * 确认发布
 */
async function confirmRelease(version) {
  newline()
  info(`📦 准备发布版本: ${version}`)
  const shouldRelease = await confirm('确认发布?', false)

  if (!shouldRelease) {
    warn('\n✋ 已取消发布')
    process.exit(0)
  }
}

/**
 * 更新 package.json 文件的版本号
 */
async function updatePackageVersion(packagePath, version) {
  const pkg = await readJSON(packagePath)
  pkg.version = version
  await writeJSON(packagePath, pkg)
  success(`✅ 已更新: ${relative(PROJECT_ROOT, packagePath)}`)
}

/**
 * 检查工作目录是否干净
 */
function checkGitStatus() {
  const status = getOutput('git status --porcelain')

  if (status.trim()) {
    error('❌ Git 工作目录不干净，请先提交或暂存更改')
    newline()
    info('当前未提交的更改:')
    console.log(status)
    process.exit(1)
  }
}

/**
 * 主函数
 */
async function main() {
  info('🚀 开始发布流程...')

  // 1. 检查 Git 状态
  await section('检查 Git 工作目录状态', async () => {
    checkGitStatus()
    success('✅ Git 工作目录干净')
  })

  // 2. 读取当前版本
  const currentVersion = await getCurrentVersion()

  // 3. 选择版本类型（交互式）或直接从命令行参数获取
  let version
  const args = process.argv.slice(2)

  if (args.length > 0) {
    // 命令行参数模式：支持直接指定版本号或类型
    const arg = args[0]

    if (arg === 'patch' || arg === 'minor' || arg === 'major') {
      version = bumpVersion(currentVersion, arg)
      newline()
      info(`📦 自动递增 ${arg} 版本: ${currentVersion} → ${version}`)
    }
    else if (/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(arg)) {
      version = arg
      newline()
      info(`📦 使用指定版本: ${version}`)
    }
    else {
      error('❌ 参数无效')
      newline()
      info('使用方式:')
      info('  pnpm release          # 交互式选择')
      info('  pnpm release patch    # 自动递增修订号')
      info('  pnpm release minor    # 自动递增次版本号')
      info('  pnpm release major    # 自动递增主版本号')
      info('  pnpm release 1.0.0    # 指定版本号')
      process.exit(1)
    }
  }
  else {
    // 交互式模式
    version = await selectVersionType(currentVersion)
  }

  // 4. 确认发布
  await confirmRelease(version)

  // 5. 更新所有 package.json 的版本号
  await section('更新 package.json 版本号', async () => {
    // 根目录
    await updatePackageVersion(join(PROJECT_ROOT, 'package.json'), version)

    // apps 目录
    const appsDir = join(PROJECT_ROOT, 'apps')
    const apps = await getSubDirectories(appsDir)

    for (const app of apps) {
      const packagePath = join(appsDir, app, 'package.json')
      if (exists(packagePath)) {
        await updatePackageVersion(packagePath, version)
      }
    }

    // packages 目录
    const packagesDir = join(PROJECT_ROOT, 'packages')
    const packages = await getSubDirectories(packagesDir)

    for (const pkg of packages) {
      const packagePath = join(packagesDir, pkg, 'package.json')
      if (exists(packagePath)) {
        await updatePackageVersion(packagePath, version)
      }
    }

    newline()
    success('✅ 所有版本号已更新')
  })

  // 6. Git 提交
  await section('提交版本更新', async () => {
    exec('git add .')
    exec(`git commit -m "chore: release v${version}"`)
  })

  // 7. 创建 Git tag
  await section('创建 Git Tag', async () => {
    exec(`git tag -a v${version} -m "Release v${version}"`)
  })

  // 8. 推送到远程
  await section('推送到远程仓库', async () => {
    exec('git push')
    exec('git push --tags')
  })

  newline()
  success('✨ 发布流程完成！')
  newline()
  info(`📌 版本: v${version}`)
  info('🔗 GitHub Actions 将自动构建并发布桌面应用')
  info('🔗 查看构建进度: https://github.com/VinkyDev/vtft/actions')
  newline()
}

// 执行主函数
main().catch((err) => {
  newline()
  error(`❌ 发布失败: ${err.message}`)
  process.exit(1)
})
