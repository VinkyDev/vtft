/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface CompCardSkeletonProps {
  /** 卡片数量 */
  count?: number
  /** 容器类名 */
  className?: string
}

/** 阵容卡片骨架屏 */
export const CompCardSkeleton = memo(({ count = 5, className = '' }: CompCardSkeletonProps) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/[0.02] p-2.5"
        >
          <div className="flex items-start gap-2.5">
            {/* 左侧: Tier 徽章骨架 */}
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <SkeletonBase className="h-6 w-6 rounded" />
            </div>

            {/* 中间: 阵容信息骨架 */}
            <div className="min-w-0 flex-1 space-y-1.5">
              {/* 名称和标签 */}
              <div className="flex items-center gap-1.5">
                <SkeletonBase className="h-4 w-32 rounded" />
                <SkeletonBase className="h-4 w-12 rounded-full" shimmer={false} />
              </div>

              {/* 羁绊图标 */}
              <div className="flex flex-wrap gap-0.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div

                    key={j}
                    className="relative overflow-hidden h-5 w-5 rounded border border-white/10 bg-black/30"
                  >
                    <div className="absolute inset-0 animate-skeleton-pulse bg-white/10" />
                  </div>
                ))}
              </div>

              {/* 英雄图标 */}
              <div className="flex flex-wrap gap-0.5">
                {Array.from({ length: 6 }).map((_, j) => (

                  <div key={j} className="flex flex-col items-center gap-0.5">
                    <div className="relative overflow-hidden h-7 w-9 rounded border-2 border-white/20 bg-linear-to-br from-gray-700/50 to-gray-800/50">
                      <div className="absolute inset-0 animate-skeleton-pulse bg-white/15" />
                    </div>
                    <div className="flex gap-0.5">
                      <SkeletonBase className="h-3 w-3 rounded" shimmer={false} />
                      <SkeletonBase className="h-3 w-3 rounded" shimmer={false} />
                      <SkeletonBase className="h-3 w-3 rounded" shimmer={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧: 数据指标骨架 */}
            <div className="flex shrink-0 flex-col gap-1 text-right self-center">
              {Array.from({ length: 4 }).map((_, j) => (

                <div key={j} className="flex items-center gap-2 justify-end">
                  <SkeletonBase className="h-3 w-8 rounded" />
                  <SkeletonBase className="h-3 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

CompCardSkeleton.displayName = 'CompCardSkeleton'
