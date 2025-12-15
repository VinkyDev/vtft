import type { ComponentType, ReactNode } from 'react'
import { memo, Suspense } from 'react'

interface LazyTabContentProps<P extends object> {
  shouldRender: boolean
  component: ComponentType<P>
  props: P
  fallback: ReactNode
}

function LazyTabContentInner<P extends object>({
  shouldRender,
  component: Component,
  props,
  fallback,
}: LazyTabContentProps<P>) {
  if (!shouldRender) {
    return <>{fallback}</>
  }

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  )
}

export const LazyTabContent = memo(LazyTabContentInner) as typeof LazyTabContentInner
