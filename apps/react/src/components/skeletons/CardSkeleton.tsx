/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface CardSkeletonProps {
  /** 卡片数量 */
  count?: number
  /** 卡片类名 */
  className?: string
}

/** 卡片骨架屏 */
export const CardSkeleton = memo(({ count = 8, className = '' }: CardSkeletonProps) => {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex flex-col items-center gap-1 ${className}`}>
          <div className="relative overflow-hidden h-20 w-20 rounded-md border-2 border-white/20 bg-gradient-to-br from-gray-700/50 to-gray-800/50">
            <div className="absolute inset-0 animate-skeleton-pulse bg-white/15" />
          </div>
          <SkeletonBase className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
})

CardSkeleton.displayName = 'CardSkeleton'
