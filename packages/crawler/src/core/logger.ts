import process from 'node:process'

/**
 * 日志工具
 */
export const logger = {
  info: (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log(...args)
  },
  success: (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log('✓', ...args)
  },
  warn: (...args: any[]) => {
    console.warn(...args)
  },
  error: (...args: any[]) => {
    console.error(...args)
  },
}

/**
 * 获取当前工作目录
 */
export function getCwd(): string {
  return process.cwd()
}

/**
 * 程序退出
 */
export function exit(code: number): never {
  return process.exit(code)
}

/**
 * 获取命令行参数
 */
export function getArgv(): string[] {
  return process.argv
}

/**
 * 格式化持续时间
 * @param ms 毫秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const remainingMs = Math.floor(ms % 1000)

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  else if (seconds > 0) {
    return `${seconds}.${remainingMs.toString().padStart(3, '0')}s`
  }
  return `${ms}ms`
}

/**
 * 包装异步函数并自动计时
 * @param fn 要执行的异步函数
 * @param taskName 任务名称
 * @returns 包装后的函数执行结果
 */
export async function withTimer<T>(
  fn: () => Promise<T>,
  taskName: string,
): Promise<T> {
  const startTime = Date.now()
  logger.info(`开始${taskName}...`)

  try {
    const result = await fn()
    const duration = Date.now() - startTime
    logger.info(`${taskName}完成，耗时: ${formatDuration(duration)}`)
    return result
  }
  catch (error) {
    const duration = Date.now() - startTime
    logger.error(`${taskName}失败 (耗时: ${formatDuration(duration)}):`, error)
    throw error
  }
}
