import type { Options, Plugin, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest as ahooksUseRequest } from 'ahooks'
import { AxiosError } from 'axios'
import { ApiError } from 'logger'
import { useErrorBoundary } from 'react-error-boundary'

export function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>,
  plugins?: Plugin<TData, TParams>[],
): Result<TData, TParams> {
  const { showBoundary } = useErrorBoundary()

  return ahooksUseRequest(service, {
    ...options,
    onError: (error, params) => {
      if (error instanceof AxiosError) {
        const apiError = new ApiError({
          code: error.code,
          message: error.message,
          httpStatus: String(error.status ?? 'unknown'),
          requestConfig: {
            ...error.config,
            params,
          },
        })
        showBoundary(apiError)
        options?.onError?.(apiError, params)
        return
      }

      showBoundary(error)
      options?.onError?.(error, params)
    },
  }, plugins)
}
