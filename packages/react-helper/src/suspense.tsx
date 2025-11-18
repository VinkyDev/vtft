import type { ComponentType, Ref } from 'react'
import { Suspense } from 'react'

export interface WithSuspenseOptions {
  /**
   * 是否转发 ref
   * @default true
   */
  shouldForwardRef?: boolean
}

// eslint-disable-next-line ts/explicit-function-return-type
export function withSuspense<T,>(Target: ComponentType<T>, Fallback?: ComponentType<T>, options: WithSuspenseOptions = {}) {
  const { shouldForwardRef = true } = options

  const WrappedTarget = shouldForwardRef
    ? (props: T & { ref?: Ref<unknown> }) => {
        const { ref, ...restProps } = props as T & { ref?: Ref<unknown> }
        return (
          // @ts-expect-error ignore
          <Suspense fallback={Fallback && <Fallback {...restProps} />}>
            <Target ref={ref} {...(restProps as T)} />
          </Suspense>
        )
      }
    : (props: T) => {
        return (
          // @ts-expect-error ignore
          <Suspense fallback={Fallback && <Fallback {...props} />}>
            {
              // @ts-expect-error ignore
              <Target {...props} />
            }
          </Suspense>
        )
      }

  // @ts-expect-error ignore
  WrappedTarget.displayName = Target.displayName ?? Fallback?.displayName

  return WrappedTarget
}
