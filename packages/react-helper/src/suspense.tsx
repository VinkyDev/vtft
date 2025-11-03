import type { ComponentType } from 'react'
import { forwardRef, Suspense } from 'react'

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

  const SuspensedTarget = shouldForwardRef
  // @ts-expect-error ignore
    ? forwardRef((props: T, ref) => {
        return (
          // @ts-expect-error ignore
          <Suspense fallback={Fallback && <Fallback {...props} />}>
            <Target ref={ref} {...props} />
          </Suspense>
        )
      })
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
  SuspensedTarget.displayName = Target.displayName ?? Fallback?.displayName

  return SuspensedTarget
}
