import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { PageSkeleton } from './skeletons'

interface SuspenseFallbackProps {
  /** 子组件 */
  children: ReactNode
  /** 自定义加载组件 */
  fallback?: ReactNode
}

/** Suspense 包装组件，提供默认骨架屏 */
export function SuspenseFallback({ children, fallback }: SuspenseFallbackProps) {
  const defaultFallback = <PageSkeleton />

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}
