/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { CompCardSkeleton } from './CompCardSkeleton'

interface CompPageSkeletonProps {
  /** 每个 tier 的卡片数量 */
  cardsPerTier?: number
  /** Tier 数量 */
  tierCount?: number
  /** 容器类名 */
  className?: string
}

/** 阵容页面骨架屏 */
export const CompPageSkeleton = memo(({
  cardsPerTier = 5,
  tierCount = 3,
  className = '',
}: CompPageSkeletonProps) => {
  return (
    <div className={`flex flex-col gap-1.5 px-2 ${className}`}>
      {Array.from({ length: tierCount }).map((_, i) => (
        <CompCardSkeleton key={i} count={cardsPerTier} />
      ))}
    </div>
  )
})

CompPageSkeleton.displayName = 'CompPageSkeleton'
