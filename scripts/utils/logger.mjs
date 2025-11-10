import { styleText } from 'node:util'

/**
 * 日志级别和颜色映射
 */
const LOG_LEVELS = {
  info: 'blue',
  success: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'gray',
}

/**
 * 创建带颜色的日志输出
 * @param {string} message - 日志消息
 * @param {'info'|'success'|'warn'|'error'|'debug'} level - 日志级别
 */
export function log(message, level = 'info') {
  const color = LOG_LEVELS[level] || 'reset'
  console.log(styleText(color, message))
}

/**
 * 信息日志 (蓝色)
 */
export function info(message) {
  log(message, 'info')
}

/**
 * 成功日志 (绿色)
 */
export function success(message) {
  log(message, 'success')
}

/**
 * 警告日志 (黄色)
 */
export function warn(message) {
  log(message, 'warn')
}

/**
 * 错误日志 (红色)
 */
export function error(message) {
  log(message, 'error')
}

/**
 * 调试日志 (灰色)
 */
export function debug(message) {
  log(message, 'debug')
}

/**
 * 带标签的日志输出
 * @param {string} tag - 标签名称
 * @param {string} message - 日志消息
 * @param {'info'|'success'|'warn'|'error'|'debug'} level - 日志级别
 */
export function logWithTag(tag, message, level = 'info') {
  const color = LOG_LEVELS[level] || 'reset'
  const tagColor = level === 'error' ? 'red' : level === 'success' ? 'green' : 'cyan'
  console.log(styleText(tagColor, `[${tag}]`), styleText(color, message))
}

/**
 * 带时间戳的日志输出
 * @param {string} message - 日志消息
 * @param {'info'|'success'|'warn'|'error'|'debug'} level - 日志级别
 */
export function logWithTime(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  const color = LOG_LEVELS[level] || 'reset'
  console.log(styleText('gray', `[${timestamp}]`), styleText(color, message))
}

/**
 * 空行输出
 */
export function newline() {
  console.log()
}

/**
 * 分隔线
 * @param {number} length - 分隔线长度
 */
export function separator(length = 50) {
  console.log(styleText('gray', '─'.repeat(length)))
}

/**
 * 带标题的区块输出
 * @param {string} title - 标题
 * @param {Function} callback - 回调函数，在区块内执行
 */
export async function section(title, callback) {
  newline()
  console.log(styleText('bold', `▶ ${title}`))
  separator()
  await callback()
  separator()
}

/**
 * 进度日志
 * @param {number} current - 当前进度
 * @param {number} total - 总数
 * @param {string} message - 消息
 */
export function progress(current, total, message = '') {
  const percentage = Math.round((current / total) * 100)
  const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2))
  console.log(`${styleText('cyan', bar)} ${percentage}% ${message}`)
}

/**
 * 表格输出
 * @param {Array<{label: string, value: string}>} rows - 表格行数据
 */
export function table(rows) {
  const maxLabelLength = Math.max(...rows.map(r => r.label.length))
  rows.forEach(({ label, value }) => {
    const paddedLabel = label.padEnd(maxLabelLength)
    console.log(styleText('gray', `  ${paddedLabel}  ${value}`))
  })
}

/**
 * 计时器
 */
export class Timer {
  constructor() {
    this.startTime = Date.now()
  }

  /**
   * 获取经过的时间（秒）
   */
  elapsed() {
    return ((Date.now() - this.startTime) / 1000).toFixed(2)
  }

  /**
   * 重置计时器
   */
  reset() {
    this.startTime = Date.now()
  }

  /**
   * 打印经过的时间
   */
  log(message = '耗时') {
    console.log(styleText('gray', `${message}: ${this.elapsed()}s`))
  }
}
