import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { CompPageSkeleton, PageSkeleton } from './skeletons'

interface SuspenseFallbackProps {
  /** 子组件 */
  children: ReactNode
  /** 自定义加载组件 */
  fallback?: ReactNode
  /** 骨架屏类型 */
  skeletonType?: 'default' | 'comp'
}

/** Suspense 包装组件，提供默认骨架屏 */
export function SuspenseFallback({ children, fallback, skeletonType = 'default' }: SuspenseFallbackProps) {
  const defaultFallback = skeletonType === 'comp' ? <CompPageSkeleton /> : <PageSkeleton />

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}
