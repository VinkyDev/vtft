export interface RetryOptions {
  /** 最大重试次数 */
  maxAttempts?: number
  /** 重试延迟（毫秒） */
  delay?: number
  /** 延迟倍增因子 */
  backoffFactor?: number
  /** 是否在重试时打印日志 */
  verbose?: boolean
  /** 判断是否应该重试的函数 */
  shouldRetry?: (error: unknown) => boolean
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoffFactor: 2,
  verbose: true,
  shouldRetry: () => true,
}

/**
 * 通用重试函数
 * @param fn 需要重试的异步函数
 * @param options 重试配置选项
 * @returns 函数执行结果
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...defaultOptions, ...options }
  let lastError: unknown

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn()
    }
    catch (error) {
      lastError = error

      // 检查是否应该重试
      if (!opts.shouldRetry(error)) {
        throw error
      }

      // 如果是最后一次尝试，直接抛出错误
      if (attempt === opts.maxAttempts) {
        if (opts.verbose) {
          console.error(`重试失败，已达到最大重试次数 (${opts.maxAttempts})`)
        }
        throw error
      }

      // 计算延迟时间（指数退避）
      const delayTime = opts.delay * opts.backoffFactor ** (attempt - 1)

      if (opts.verbose) {
        console.warn(
          `第 ${attempt} 次尝试失败，${delayTime}ms 后进行第 ${attempt + 1} 次重试...`,
          error,
        )
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delayTime))
    }
  }

  throw lastError
}
