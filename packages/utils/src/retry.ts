import { sleep } from './common'

/**
 * 自动重试import动态加载组件资源：加载异常，等待1s再次尝试加载
 */
export function retryLoadWithFallBack<T>({
  fn,
  retriesLeft = 3,
  interval = 1000,
  fallback = { default: () => null },
  onError = () => {
    /** empty */
  },
}: {
  fn: () => Promise<T>
  retriesLeft?: number
  interval?: number
  fallback?: T | { default: () => unknown }
  onError?: (error: unknown) => void
}): Promise<T> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((err: Error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            console.error('retryLoadWithFallBack error:', err)

            // 回调
            onError?.(err)

            // 发生错误时用 fallback 代替
            resolve(fallback as T)

            return
          }
          retryLoadWithFallBack({
            fn,
            retriesLeft: retriesLeft - 1,
            interval,
            fallback,
            onError,
          }).then(resolve, reject)
        }, interval)
      })
  })
}

/**
 * 执行异步任务，失败后自动重试
 * @param func 需要重试的异步任务
 * @param tryTimes 最多尝试次数
 *
 * @param interval 两次尝试之间的间隔（单位：ms）。
 * - 可以传数字（固定间隔）
 * - 或函数（动态间隔）——函数接收 nextTryIndex 参数，表示下一次尝试的序号，该参数 ≥ 1。返回 number，表示下一次尝试前，需要等待多久。
 * 例如：
 * ```js
 * (nextTryIndex) => nextTryIndex * 200; // 间隔为：第一次调用 → 200ms → 第二次调用 → 400ms → 第三次调用
 * ```
 *
 * @param onRetryError 在中途某次尝试失败后的错误处理函数。接收参数 error 为错误，tryIndex 表示这次尝试的索引。
 * 最后一次尝试失败会直接整个 retryAsync 抛错，不会走 onRetryError 函数
 */
export async function retryAsync<T>(func: () => Promise<T>, tryTimes: number, interval: number | ((nextTryIndex: number) => number), onRetryError?: (error: unknown, tryIndex: number) => void): Promise<T> {
  for (let i = 0; i < tryTimes; i++) {
    const nextTryIndex = i + 1

    try {
      return await func()
    }
    catch (e) {
      if (nextTryIndex >= tryTimes) {
        // 最后一轮直接往外抛
        throw e
      }
      onRetryError?.(e, i)
    }

    const intervalNum
      = typeof interval === 'number' ? interval : interval(nextTryIndex)
    await sleep(intervalNum)
  }

  throw new Error('retry times out of limit')
}

export function withRetry<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  {
    maxRetries = 3,
    delayMs = 1000,
    delayFn,
    onRetry,
  }: {
    maxRetries?: number
    delayMs?: number
    delayFn?: (attempt: number) => number
    onRetry?: (error: unknown, attempt: number) => void
  } = {},
): (...args: T) => Promise<R> {
  return (...args: T) =>
    retryAsync(
      () => fn(...args),
      maxRetries,
      delayFn ?? (i => delayMs * i),
      onRetry,
    )
}
