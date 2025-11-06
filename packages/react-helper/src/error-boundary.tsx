import type { ErrorInfo } from 'react'
import type {
  ErrorBoundaryPropsWithRender,
  ErrorBoundaryProps as ReactErrorBoundaryProps,
} from 'react-error-boundary'
import { once } from 'lodash-es'
import logger from 'logger'
import React, { forwardRef, isValidElement, useCallback, version } from 'react'

import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
} from 'react-error-boundary'

export type { FallbackProps } from 'react-error-boundary'

export type FallbackRender = ErrorBoundaryPropsWithRender['fallbackRender']

export { useErrorBoundary }

export enum ErrorBoundaryScopeEnum {
  Page = 'page',
  Component = 'component',
}

export type ErrorBoundaryProps = ReactErrorBoundaryProps & {
  /**
   * errorBoundaryName，用于在发生错误时上报
   */
  errorBoundaryName: string
  /**
   * children
   */
  children?: React.ReactNode
  /**
   * 错误来源
   */
  errorBoundaryScope?: ErrorBoundaryScopeEnum
}

export const ErrorBoundary = forwardRef<ReactErrorBoundary, ErrorBoundaryProps>(
  (
    {
      onError: propsOnError,
      errorBoundaryName = 'unknown',
      children,
      errorBoundaryScope = ErrorBoundaryScopeEnum.Component,
      ...restProps
    },
    ref,
  ) => {
    const { fallback, fallbackRender, FallbackComponent } = restProps

    const logFallbackPropsEmpty = useCallback(
      once(() => {
        logger?.error({
          namespace: errorBoundaryName,
          scope: errorBoundaryScope,
          message: 'boundary_fallback_props_empty',
          error: new Error('boundary_fallback_props_empty'),
        })
      }),
      [],
    )

    // 判断 fallback 是否为空，https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.ts
    if (
      !(
        typeof fallbackRender === 'function'
        || FallbackComponent
        || fallback === null
        || isValidElement(fallback)
      )
    ) {
      logFallbackPropsEmpty()
      // 如果所有 fallback 都无效，则指定一个兜底 fallback
      restProps.fallback = null
    }

    const onError = useCallback(
      (error: Error, info: ErrorInfo) => {
        const { componentStack } = info
        const cause = error.cause as {
          msg: string
          logId: string
          isNotError?: boolean
        }

        const meta = {
          reportJsError: !cause?.isNotError, // 标记为 JS Error，上报走 slardar.captureException
          errorBoundaryName,
          errorBoundaryScope,
          reactInfo: {
            componentStack,
            version,
            is_package: 1,
          },
        }

        logger?.error({
          namespace: errorBoundaryName,
          scope: errorBoundaryScope,
          message: 'boundary_react_error_collection',
          error,
          meta,
        })

        propsOnError?.(error, info)
      },
      [],
    )

    return (
      <ReactErrorBoundary {...restProps} onError={onError} ref={ref}>
        {children}
      </ReactErrorBoundary>
    )
  },
)

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: ErrorBoundaryProps,
): React.ComponentType<P> {
  const Wrapped: React.ComponentType<P> = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  const name = Component.displayName || Component.name || 'Unknown'
  Wrapped.displayName = `withErrorBoundary(${name})`

  return Wrapped
}
