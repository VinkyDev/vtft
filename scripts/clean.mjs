import { rm, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

/**
 * 递归删除文件或目录
 * @param {string} path - 要删除的路径
 */
async function removeRecursive(path) {
  if (existsSync(path)) {
    try {
      await rm(path, { recursive: true, force: true, maxRetries: 3 })
      console.log(`✓ 已删除: ${path}`)
    } catch (error) {
      console.error(`✗ 删除失败: ${path}`, error.message)
    }
  }
}

/**
 * 在指定目录中查找并删除匹配的文件/目录
 * @param {string} baseDir - 基础目录
 * @param {string[]} patterns - 要删除的文件/目录名称
 */
async function cleanPatterns(baseDir, patterns) {
  for (const pattern of patterns) {
    const targetPath = join(baseDir, pattern)
    await removeRecursive(targetPath)
  }
}

/**
 * 获取目录下的所有子目录
 * @param {string} dirPath - 目录路径
 * @returns {Promise<string[]>} 子目录名称列表
 */
async function getSubDirectories(dirPath) {
  if (!existsSync(dirPath)) {
    return []
  }

  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  } catch (error) {
    console.error(`✗ 读取目录失败: ${dirPath}`, error.message)
    return []
  }
}

// 从命令行参数获取清理类型
const cleanType = process.argv[2]

if (cleanType === 'dist') {
  console.log('🧹 清理构建产物...\n')

  const distPatterns = ['*.tsbuildinfo', '.cache', 'build', 'dist', '.hash']

  // 清理根目录
  await cleanPatterns(rootDir, distPatterns)

  // 清理 apps 下的所有子目录
  const appsDir = join(rootDir, 'apps')
  const appsSubDirs = await getSubDirectories(appsDir)
  for (const subDir of appsSubDirs) {
    await cleanPatterns(join(appsDir, subDir), distPatterns)
  }

  // 清理 packages 下的所有子目录
  const packagesDir = join(rootDir, 'packages')
  const packagesSubDirs = await getSubDirectories(packagesDir)
  for (const subDir of packagesSubDirs) {
    await cleanPatterns(join(packagesDir, subDir), distPatterns)
  }

  console.log('\n✅ 构建产物清理完成！')
} else if (cleanType === 'modules') {
  console.log('🧹 清理 node_modules...\n')

  // 清理 apps 下的所有子目录的 node_modules
  const appsDir = join(rootDir, 'apps')
  const appsSubDirs = await getSubDirectories(appsDir)
  for (const subDir of appsSubDirs) {
    await removeRecursive(join(appsDir, subDir, 'node_modules'))
  }

  // 清理 packages 下的所有子目录的 node_modules
  const packagesDir = join(rootDir, 'packages')
  const packagesSubDirs = await getSubDirectories(packagesDir)
  for (const subDir of packagesSubDirs) {
    await removeRecursive(join(packagesDir, subDir, 'node_modules'))
  }

  // 最后清理根目录的 node_modules
  await removeRecursive(join(rootDir, 'node_modules'))

  console.log('\n✅ node_modules 清理完成！')
} else {
  console.error('❌ 用法: node scripts/clean.mjs [dist|modules]')
  process.exit(1)
}

