import type { Options, Plugin, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest as ahooksUseRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { ApiError } from 'logger'
import { useErrorBoundary } from 'react-error-boundary'

/**
 * 可恢复的 HTTP 状态码
 * 这些错误不会抛到 ErrorBoundary，而是让组件自行处理
 */
const RECOVERABLE_STATUS_CODES = new Set([
  408, // Request Timeout
  429, // Too Many Requests
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
])

/**
 * 可恢复的 Axios 错误码
 */
const RECOVERABLE_ERROR_CODES = new Set([
  'ECONNABORTED', // 请求超时
  'ERR_NETWORK', // 网络错误
  'ETIMEDOUT', // 连接超时
])

/**
 * 判断错误是否可恢复（可以重试）
 */
function isRecoverableError(error: AxiosError): boolean {
  // 检查 HTTP 状态码
  if (error.response?.status && RECOVERABLE_STATUS_CODES.has(error.response.status)) {
    return true
  }

  // 检查 Axios 错误码
  if (error.code && RECOVERABLE_ERROR_CODES.has(error.code)) {
    return true
  }

  return false
}

export interface UseRequestOptions<TData, TParams extends any[]> extends Options<TData, TParams> {
  /**
   * 是否将错误抛到 ErrorBoundary
   * - true: 所有错误都抛到 ErrorBoundary（默认行为）
   * - false: 不抛到 ErrorBoundary，由组件自行处理
   * - 'auto': 自动判断，可恢复错误不抛，不可恢复错误抛
   */
  throwOnError?: boolean | 'auto'
}

export function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: UseRequestOptions<TData, TParams>,
  plugins?: Plugin<TData, TParams>[],
): Result<TData, TParams> {
  const { showBoundary } = useErrorBoundary()
  const { throwOnError = 'auto', ...restOptions } = options ?? {}

  return ahooksUseRequest(service, {
    ...restOptions,
    onError: (error, params) => {
      // 如果明确指定不抛错误，直接调用用户的 onError
      if (throwOnError === false) {
        options?.onError?.(error, params)
        return
      }

      if (error instanceof AxiosError) {
        const apiError = new ApiError({
          code: error.code,
          message: error.message,
          httpStatus: String(error.response?.status ?? error.status ?? 'unknown'),
          requestConfig: {
            ...error.config,
            params,
          },
        })

        // 自动模式下，可恢复错误不抛到 ErrorBoundary
        if (throwOnError === 'auto' && isRecoverableError(error)) {
          options?.onError?.(apiError, params)
          return
        }

        showBoundary(apiError)
        options?.onError?.(apiError, params)
        return
      }

      // 非 AxiosError，根据配置决定是否抛到 ErrorBoundary
      if (throwOnError === true || throwOnError === 'auto') {
        showBoundary(error)
      }
      options?.onError?.(error, params)
    },
  }, plugins)
}
