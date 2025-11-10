#!/usr/bin/env node

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

/**
 * 读取根目录 package.json 的当前版本
 */
function getCurrentVersion() {
  const packagePath = path.join(rootDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
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
 * 创建交互式选择界面
 */
function createPrompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

/**
 * 显示版本选择菜单并获取用户选择
 */
async function selectVersionType(currentVersion) {
  console.log(`\n当前版本: ${currentVersion}\n`)
  console.log('请选择版本更新类型:\n')
  console.log(`  1. Patch   (修订号) → ${bumpVersion(currentVersion, 'patch')} (bug 修复)`)
  console.log(`  2. Minor   (次版本) → ${bumpVersion(currentVersion, 'minor')} (新功能，向下兼容)`)
  console.log(`  3. Major   (主版本) → ${bumpVersion(currentVersion, 'major')} (重大更新，不兼容)`)
  console.log('  4. Custom  (自定义版本号)')
  console.log('  0. Cancel  (取消)\n')

  const choice = await createPrompt('请输入选项 (1/2/3/4/0): ')

  switch (choice) {
    case '1':
      return bumpVersion(currentVersion, 'patch')
    case '2':
      return bumpVersion(currentVersion, 'minor')
    case '3':
      return bumpVersion(currentVersion, 'major')
    case '4': {
      const customVersion = await createPrompt('请输入自定义版本号 (例如: 1.0.0-beta.1): ')
      // 验证版本号格式
      if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(customVersion)) {
        throw new Error('版本号格式不正确，请使用 semver 格式，例如: 0.0.11 或 1.0.0-beta.1')
      }
      return customVersion
    }
    case '0':
      console.log('\n✋ 已取消发布')
      process.exit(0)
    default:
      throw new Error('无效的选项，请输入 1, 2, 3, 4 或 0')
  }
}

/**
 * 确认发布
 */
async function confirmRelease(version) {
  console.log(`\n📦 准备发布版本: ${version}`)
  const confirm = await createPrompt('\n确认发布? (y/n): ')

  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('\n✋ 已取消发布')
    process.exit(0)
  }
}

/**
 * 更新 package.json 文件的版本号
 */
function updatePackageVersion(packagePath, version) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
  console.log(`✅ 已更新: ${path.relative(rootDir, packagePath)}`)
}

/**
 * 执行命令并打印输出
 */
function exec(command, options = {}) {
  console.log(`\n🔧 执行: ${command}`)
  try {
    execSync(command, {
      cwd: rootDir,
      stdio: 'inherit',
      ...options,
    })
  }
  catch (error) {
    console.error(`❌ 命令执行失败: ${command}`)
    throw error
  }
}

/**
 * 检查工作目录是否干净
 */
function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', {
      cwd: rootDir,
      encoding: 'utf-8',
    })

    if (status.trim()) {
      console.error('❌ Git 工作目录不干净，请先提交或暂存更改')
      console.log('\n当前未提交的更改:')
      console.log(status)
      process.exit(1)
    }
  }
  catch (error) {
    console.error('❌ 检查 Git 状态失败')
    throw error
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始发布流程...')

  // 1. 检查 Git 状态
  console.log('\n🔍 检查 Git 工作目录状态...')
  checkGitStatus()
  console.log('✅ Git 工作目录干净')

  // 2. 读取当前版本
  const currentVersion = getCurrentVersion()

  // 3. 选择版本类型（交互式）或直接从命令行参数获取
  let version
  const args = process.argv.slice(2)

  if (args.length > 0) {
    // 命令行参数模式：支持直接指定版本号或类型
    const arg = args[0]

    if (arg === 'patch' || arg === 'minor' || arg === 'major') {
      version = bumpVersion(currentVersion, arg)
      console.log(`\n📦 自动递增 ${arg} 版本: ${currentVersion} → ${version}`)
    }
    else if (/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(arg)) {
      version = arg
      console.log(`\n📦 使用指定版本: ${version}`)
    }
    else {
      console.error('❌ 参数无效')
      console.log('\n使用方式:')
      console.log('  pnpm release          # 交互式选择')
      console.log('  pnpm release patch    # 自动递增修订号')
      console.log('  pnpm release minor    # 自动递增次版本号')
      console.log('  pnpm release major    # 自动递增主版本号')
      console.log('  pnpm release 1.0.0    # 指定版本号')
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
  console.log('\n📝 更新 package.json 版本号...\n')

  // 根目录
  updatePackageVersion(path.join(rootDir, 'package.json'), version)

  // apps 目录
  const appsDir = path.join(rootDir, 'apps')
  const apps = fs.readdirSync(appsDir).filter((dir) => {
    const packagePath = path.join(appsDir, dir, 'package.json')
    return fs.existsSync(packagePath)
  })

  for (const app of apps) {
    updatePackageVersion(path.join(appsDir, app, 'package.json'), version)
  }

  // packages 目录
  const packagesDir = path.join(rootDir, 'packages')
  const packages = fs.readdirSync(packagesDir).filter((dir) => {
    const packagePath = path.join(packagesDir, dir, 'package.json')
    return fs.existsSync(packagePath)
  })

  for (const pkg of packages) {
    updatePackageVersion(path.join(packagesDir, pkg, 'package.json'), version)
  }

  console.log('\n✅ 所有版本号已更新')

  // 6. Git 提交
  console.log('\n📦 提交版本更新...')
  exec('git add .')
  exec(`git commit -m "chore: release v${version}"`)

  // 7. 创建 Git tag
  console.log('\n🏷️  创建 Git Tag...')
  exec(`git tag -a v${version} -m "Release v${version}"`)

  // 8. 推送到远程
  console.log('\n⬆️  推送到远程仓库...')
  exec('git push')
  exec('git push --tags')

  console.log('\n✨ 发布流程完成！')
  console.log(`\n📌 版本: v${version}`)
  console.log('🔗 GitHub Actions 将自动构建并发布桌面应用')
  console.log('🔗 查看构建进度: https://github.com/VinkyDev/vtft/actions\n')
}

// 执行主函数
main().catch((error) => {
  console.error('\n❌ 发布失败:', error.message)
  process.exit(1)
})
