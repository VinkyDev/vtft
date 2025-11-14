import { join } from 'node:path'
import {
  removeRecursive,
  cleanPatterns,
  getSubDirectories,
  PROJECT_ROOT,
  info,
  success,
  error,
  newline,
  section,
} from './utils/index.mjs'

/**
 * 清理构建产物
 */
async function cleanDist() {
  await section('清理构建产物', async () => {
    const distPatterns = ['*.tsbuildinfo', '.cache', 'build', 'dist', '.hash']

    // 清理根目录
    await cleanPatterns(PROJECT_ROOT, distPatterns)

    // 清理 apps 下的所有子目录
    const appsDir = join(PROJECT_ROOT, 'apps')
    const appsSubDirs = await getSubDirectories(appsDir)
    for (const subDir of appsSubDirs) {
      await cleanPatterns(join(appsDir, subDir), distPatterns)
    }

    // 清理 packages 下的所有子目录
    const packagesDir = join(PROJECT_ROOT, 'packages')
    const packagesSubDirs = await getSubDirectories(packagesDir)
    for (const subDir of packagesSubDirs) {
      await cleanPatterns(join(packagesDir, subDir), distPatterns)
    }

    newline()
    success('✅ 构建产物清理完成！')
  })
}

/**
 * 清理 node_modules
 */
async function cleanModules() {
  await section('清理 node_modules', async () => {
    // 清理 apps 下的所有子目录的 node_modules
    const appsDir = join(PROJECT_ROOT, 'apps')
    const appsSubDirs = await getSubDirectories(appsDir)
    for (const subDir of appsSubDirs) {
      await removeRecursive(join(appsDir, subDir, 'node_modules'))
    }

    // 清理 packages 下的所有子目录的 node_modules
    const packagesDir = join(PROJECT_ROOT, 'packages')
    const packagesSubDirs = await getSubDirectories(packagesDir)
    for (const subDir of packagesSubDirs) {
      await removeRecursive(join(packagesDir, subDir, 'node_modules'))
    }

    // 最后清理根目录的 node_modules
    await removeRecursive(join(PROJECT_ROOT, 'node_modules'))

    newline()
    success('✅ node_modules 清理完成！')
  })
}

// 从命令行参数获取清理类型
const cleanType = process.argv[2]

try {
  if (cleanType === 'dist') {
    await cleanDist()
  }
  else if (cleanType === 'modules') {
    await cleanModules()
  }
  else {
    error('❌ 用法: node scripts/clean.mjs [dist|modules]')
    info('  dist    - 清理构建产物 (dist, build, .cache 等)')
    info('  modules - 清理 node_modules')
    process.exit(1)
  }
}
catch (err) {
  error(`清理失败: ${err.message}`)
  process.exit(1)
}

