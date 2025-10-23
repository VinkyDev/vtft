#!/usr/bin/env node

/**
 * Server 构建和发布脚本
 * 执行完整的构建和发布流程
 */

import * as p from '@clack/prompts'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(__dirname, '..')
const publishDir = join(rootDir, 'publish')

function exec(command, cwd = rootDir) {
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env },
    })
    return true
  }
  catch (error) {
    p.log.error(`命令执行失败: ${command}`)
    return false
  }
}

function copyDir(src, dest) {
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true })
    return true
  }
  else {
    p.log.warn(`${src} 不存在，跳过`)
    return false
  }
}

async function cleanBuildArtifacts() {
  p.log.step('清理旧的构建产物...')
  const distDirs = [
    join(rootDir, 'apps/server/dist'),
    join(rootDir, 'packages/db/dist'),
    join(rootDir, 'packages/crawler/dist'),
    join(rootDir, 'packages/types/dist'),
    join(rootDir, 'packages/utils/dist'),
  ]

  distDirs.forEach((dir) => {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })
}

async function buildPackages() {
  p.log.step('构建共享包 (types, utils)...')

  const s1 = p.spinner()
  s1.start('构建 types...')
  if (!exec('pnpm --filter types run build')) {
    s1.stop('构建 types 失败', 1)
    return false
  }
  s1.stop('types 构建完成')

  const s2 = p.spinner()
  s2.start('构建 utils...')
  if (!exec('pnpm --filter utils run build')) {
    s2.stop('构建 utils 失败', 1)
    return false
  }
  s2.stop('utils 构建完成')

  return true
}

async function buildDatabase() {
  p.log.step('构建数据库包 (db)...')
  const s = p.spinner()
  s.start('构建中...')
  const result = exec('pnpm --filter db run build')
  s.stop(result ? 'db 构建完成' : '构建失败', result ? 0 : 1)
  return result
}

async function buildCrawler() {
  p.log.step('构建爬虫包 (crawler)...')
  const s = p.spinner()
  s.start('构建中...')
  const result = exec('pnpm --filter crawler run build')
  s.stop(result ? 'crawler 构建完成' : '构建失败', result ? 0 : 1)
  return result
}

async function buildServer() {
  p.log.step('构建 Server 应用...')
  const s = p.spinner()
  s.start('构建中...')
  const result = exec('pnpm --filter server run build')
  s.stop(result ? 'server 构建完成' : '构建失败', result ? 0 : 1)
  return result
}

async function cleanPublishDir() {
  p.log.step('清理旧的发布目录...')
  if (existsSync(publishDir)) {
    rmSync(publishDir, { recursive: true, force: true })
  }
  mkdirSync(publishDir, { recursive: true })
}

async function copyBuildArtifacts() {
  p.log.step('复制构建产物...')

  const serverDist = join(rootDir, 'apps/server/dist')
  if (!existsSync(serverDist)) {
    p.log.error('Server 构建产物不存在，请先运行构建')
    return false
  }

  // 创建目录结构
  mkdirSync(join(publishDir, 'apps/server'), { recursive: true })
  mkdirSync(join(publishDir, 'packages'), { recursive: true })

  // 复制 Server 构建产物
  copyDir(serverDist, join(publishDir, 'apps/server/dist'))

  // 复制包构建产物
  copyDir(join(rootDir, 'packages/db/dist'), join(publishDir, 'packages/db/dist'))
  copyDir(join(rootDir, 'packages/crawler/dist'), join(publishDir, 'packages/crawler/dist'))
  copyDir(join(rootDir, 'packages/types/dist'), join(publishDir, 'packages/types/dist'))
  copyDir(join(rootDir, 'packages/utils/dist'), join(publishDir, 'packages/utils/dist'))

  return true
}

async function generatePackageJson() {
  p.log.step('生成 package.json 文件...')

  // 读取原始 package.json
  const rootPackageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'))
  const serverPackageJson = JSON.parse(readFileSync(join(rootDir, 'apps/server/package.json'), 'utf-8'))

  // 生成生产环境的 package.json
  const productionPackageJson = {
    name: 'vtft-server',
    version: rootPackageJson.version || '1.0.0',
    type: 'module',
    private: true,
    scripts: {
      start: 'NODE_ENV=production node --import tsx apps/server/dist/index.js',
      'install:playwright': 'npx playwright install chromium --with-deps',
    },
    dependencies: {
      ...serverPackageJson.dependencies,
      // 添加 crawler 的依赖
      cheerio: '^1.1.2',
      playwright: '^1.49.0',
      // tsx 用于运行 TypeScript 编译后的代码（解决 ES Module 导入问题）
      tsx: '^4.19.2',
    },
    engines: {
      node: '>= 18',
    },
  }

  writeFileSync(
    join(publishDir, 'package.json'),
    JSON.stringify(productionPackageJson, null, 2),
  )
}

async function copyWorkspaceYaml() {
  p.log.step('复制 pnpm-workspace.yaml...')
  const workspaceYamlPath = join(rootDir, 'pnpm-workspace.yaml')
  if (existsSync(workspaceYamlPath)) {
    copyDir(workspaceYamlPath, join(publishDir, 'pnpm-workspace.yaml'))
  }
  else {
    p.log.warn('pnpm-workspace.yaml 不存在，跳过')
  }
}

async function generatePackageJsonForPackages() {
  p.log.step('生成各个包的 package.json...')

  // 生成 packages 的 package.json
  const packages = ['db', 'crawler', 'types', 'utils']
  packages.forEach((pkg) => {
    const pkgJson = JSON.parse(readFileSync(join(rootDir, `packages/${pkg}/package.json`), 'utf-8'))
    const publishPkgJson = {
      name: pkgJson.name,
      version: pkgJson.version,
      type: pkgJson.type,
      main: pkgJson.main || './dist/index.js',
      types: pkgJson.types || './dist/index.d.ts',
      dependencies: pkgJson.dependencies || {},
    }
    const pkgDir = join(publishDir, `packages/${pkg}`)
    mkdirSync(pkgDir, { recursive: true })
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify(publishPkgJson, null, 2),
    )
  })

  // 复制 server 的 package.json
  const serverPackageJson = JSON.parse(readFileSync(join(rootDir, 'apps/server/package.json'), 'utf-8'))
  const serverPublishPkgJson = {
    name: serverPackageJson.name,
    version: serverPackageJson.version,
    type: serverPackageJson.type,
    main: './dist/index.js',
    scripts: {
      start: 'node dist/index.js',
    },
    dependencies: serverPackageJson.dependencies,
  }
  writeFileSync(
    join(publishDir, 'apps/server/package.json'),
    JSON.stringify(serverPublishPkgJson, null, 2),
  )
}

async function copyConfigFiles() {
  p.log.step('复制配置文件...')

  // 复制 .env.example
  const envExamplePath = join(rootDir, 'apps/server/.env.example')
  if (existsSync(envExamplePath)) {
    copyDir(envExamplePath, join(publishDir, '.env.example'))
  }

  // 复制 .env（如果存在）
  const envPath = join(rootDir, 'apps/server/.env')
  if (existsSync(envPath)) {
    copyDir(envPath, join(publishDir, '.env'))
    p.log.success('已复制现有的 .env 文件')
  }
  else {
    p.log.warn('.env 文件不存在，请在发布后手动创建')
  }

  // 创建 README
  const hasEnv = existsSync(join(publishDir, '.env'))
  const readme = `# VTFT Server 生产环境部署包

此目录包含了服务器部署所需的所有文件。

## 快速开始

1. 安装依赖：
   \`\`\`bash
   pnpm install
   pnpm run install:playwright
   \`\`\`

2. 配置环境变量：
   ${hasEnv
    ? `\`\`\`bash
   # .env 文件已自动复制，请检查并修改配置
   vim .env
   \`\`\``
    : `\`\`\`bash
   cp .env.example .env
   # 编辑 .env 文件，设置 MongoDB URI 等配置
   vim .env
   \`\`\``}

3. 启动服务：
   \`\`\`bash
   pnpm start
   \`\`\`

## 目录结构

- \`apps/server/dist/\` - Server 应用构建产物
- \`packages/\` - 依赖包构建产物
  - \`db/dist/\` - 数据库模块
  - \`crawler/dist/\` - 爬虫模块
  - \`types/dist/\` - 类型定义
  - \`utils/dist/\` - 工具函数

详细部署说明请参考项目根目录的 DEPLOYMENT.md
`

  writeFileSync(join(publishDir, 'README.md'), readme)
}

async function performBuild() {
  p.intro(pc.bgCyan(pc.black(' 构建 Server 应用 ')))

  await cleanBuildArtifacts()

  if (!await buildPackages())
    process.exit(1)
  if (!await buildDatabase())
    process.exit(1)
  if (!await buildCrawler())
    process.exit(1)
  if (!await buildServer())
    process.exit(1)

  p.outro(pc.green('✓ Server 应用构建完成！'))
  p.log.message('构建产物位置:')
  p.log.message('  - apps/server/dist      (Server 主应用)')
  p.log.message('  - packages/db/dist      (数据库模块)')
  p.log.message('  - packages/crawler/dist (爬虫模块)')
  p.log.message('  - packages/types/dist   (类型定义)')
  p.log.message('  - packages/utils/dist   (工具函数)')
}

async function performPublish() {
  p.intro(pc.bgCyan(pc.black(' 准备 Server 发布文件 ')))

  await cleanPublishDir()

  if (!await copyBuildArtifacts())
    process.exit(1)

  await generatePackageJson()
  await copyWorkspaceYaml()
  await generatePackageJsonForPackages()
  await copyConfigFiles()

  p.outro(pc.green('✓ Server 发布文件准备完成！'))
  p.log.message(`发布目录: ${publishDir}`)
  p.log.message('')
  p.log.message('下一步:')
  p.log.message('  1. 将 publish 目录打包上传到服务器')
  p.log.message('  2. 在服务器上解压并运行:')
  p.log.message('     $ pnpm install')
  p.log.message('     $ pnpm run install:playwright')

  const hasEnv = existsSync(join(publishDir, '.env'))
  if (hasEnv) {
    p.log.message('     $ # .env 已自动复制，请检查配置是否正确')
  }
  else {
    p.log.message('     $ cp .env.example .env')
    p.log.message('     $ # 编辑 .env 配置')
  }

  p.log.message('     $ pnpm start')
}

async function main() {
  console.clear()

  p.intro(pc.bgCyan(pc.black(' VTFT Server 构建工具 ')))

  try {
    await performBuild()
    console.log('')
    await performPublish()
  }
  catch (error) {
    p.log.error(`操作失败: ${error.message}`)
    process.exit(1)
  }
}

main().catch((error) => {
  p.log.error(`发生错误: ${error.message}`)
  process.exit(1)
})
