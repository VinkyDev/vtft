import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface ListSkeletonProps {
  /** 列表项数量 */
  count?: number
  /** 列表项高度 */
  itemHeight?: string
  /** 容器类名 */
  className?: string
}

/** 列表骨架屏 */
export const ListSkeleton = memo(({ count = 5, itemHeight = 'h-16', className = '' }: ListSkeletonProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBase key={i} className={`${itemHeight} w-full`} />
      ))}
    </div>
  )
})

ListSkeleton.displayName = 'ListSkeleton'
