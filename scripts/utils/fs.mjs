import { rm, readdir, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { success, error as logError } from './logger.mjs'

/**
 * 递归删除文件或目录
 * @param {string} path - 要删除的路径
 * @param {Object} options - 选项
 * @param {boolean} [options.silent=false] - 是否静默删除（不打印日志）
 * @param {number} [options.maxRetries=3] - 最大重试次数
 */
export async function removeRecursive(path, options = {}) {
  const { silent = false, maxRetries = 3 } = options

  if (!existsSync(path)) {
    return
  }

  try {
    await rm(path, { recursive: true, force: true, maxRetries })
    if (!silent) {
      success(`✓ 已删除: ${path}`)
    }
  }
  catch (err) {
    logError(`✗ 删除失败: ${path} - ${err.message}`)
    throw err
  }
}

/**
 * 在指定目录中查找并删除匹配的文件/目录
 * @param {string} baseDir - 基础目录
 * @param {string[]} patterns - 要删除的文件/目录名称
 * @param {Object} options - 选项
 */
export async function cleanPatterns(baseDir, patterns, options = {}) {
  for (const pattern of patterns) {
    const targetPath = join(baseDir, pattern)
    await removeRecursive(targetPath, options)
  }
}

/**
 * 获取目录下的所有子目录
 * @param {string} dirPath - 目录路径
 * @returns {Promise<string[]>} 子目录名称列表
 */
export async function getSubDirectories(dirPath) {
  if (!existsSync(dirPath)) {
    return []
  }

  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
  }
  catch (err) {
    logError(`✗ 读取目录失败: ${dirPath} - ${err.message}`)
    return []
  }
}

/**
 * 获取目录下的所有文件
 * @param {string} dirPath - 目录路径
 * @returns {Promise<string[]>} 文件名称列表
 */
export async function getFiles(dirPath) {
  if (!existsSync(dirPath)) {
    return []
  }

  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    return entries
      .filter(entry => entry.isFile())
      .map(entry => entry.name)
  }
  catch (err) {
    logError(`✗ 读取目录失败: ${dirPath} - ${err.message}`)
    return []
  }
}

/**
 * 确保目录存在，不存在则创建
 * @param {string} dirPath - 目录路径
 */
export async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

/**
 * 复制文件
 * @param {string} source - 源文件路径
 * @param {string} destination - 目标文件路径
 * @param {Object} options - 选项
 * @param {boolean} [options.ensureDir=true] - 是否确保目标目录存在
 */
export async function copyFileAsync(source, destination, options = {}) {
  const { ensureDir: shouldEnsureDir = true } = options

  if (shouldEnsureDir) {
    await ensureDir(dirname(destination))
  }

  await copyFile(source, destination)
}

/**
 * 检查路径是否存在
 * @param {string} path - 路径
 * @returns {boolean}
 */
export function exists(path) {
  return existsSync(path)
}

/**
 * 读取 JSON 文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<any>}
 */
export async function readJSON(filePath) {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 * 写入 JSON 文件
 * @param {string} filePath - 文件路径
 * @param {any} data - 数据
 * @param {Object} options - 选项
 * @param {number} [options.spaces=2] - 缩进空格数
 */
export async function writeJSON(filePath, data, options = {}) {
  const { spaces = 2 } = options
  const content = JSON.stringify(data, null, spaces)
  await writeFile(filePath, `${content}\n`)
}

/**
 * 读取文本文件
 * @param {string} filePath - 文件路径
 * @param {string} [encoding='utf-8'] - 编码
 * @returns {Promise<string>}
 */
export async function readText(filePath, encoding = 'utf-8') {
  return readFile(filePath, encoding)
}

/**
 * 写入文本文件
 * @param {string} filePath - 文件路径
 * @param {string} content - 内容
 * @param {string} [encoding='utf-8'] - 编码
 */
export async function writeText(filePath, content, encoding = 'utf-8') {
  await writeFile(filePath, content, encoding)
}
