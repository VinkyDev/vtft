export interface RetryOptions {
  maxRetries?: number
  delayMs?: number
  onRetry?: (error: unknown, attempt: number) => void
}

export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {},
): (...args: T) => Promise<R> {
  const { maxRetries = 3, delayMs = 1000, onRetry } = options

  return async (...args: T): Promise<R> => {
    let lastError: unknown

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      }
      catch (error) {
        lastError = error

        if (attempt < maxRetries) {
          onRetry?.(error, attempt)
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
        }
      }
    }

    throw lastError
  }
}
