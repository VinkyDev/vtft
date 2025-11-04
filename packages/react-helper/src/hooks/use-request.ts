import type { Options, Plugin, Result, Service } from 'ahooks/lib/useRequest/src/types'
import { useRequest } from 'ahooks'
import { useErrorBoundary } from 'react-error-boundary'

export function useSafeRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>,
  plugins?: Plugin<TData, TParams>[],
): Result<TData, TParams> {
  const { showBoundary } = useErrorBoundary()

  return useRequest(service, {
    ...options,
    onError: (error, params) => {
      showBoundary(error)
      options?.onError?.(error, params)
    },
  }, plugins)
}
