/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface ChampionEnhancementsGridSkeletonProps {
  /** 容器类名 */
  className?: string
}

/** 英雄果实推荐骨架屏 */
export const ChampionEnhancementsGridSkeleton = memo(({ className = '' }: ChampionEnhancementsGridSkeletonProps) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-hidden">
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/[0.02] p-2 sm:p-3"
              >
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="relative overflow-hidden h-7 w-9 rounded border-2 border-white/20 bg-linear-to-br from-gray-700/50 to-gray-800/50">
                    <div className="absolute inset-0 animate-skeleton-pulse bg-white/15" />
                  </div>
                </div>
                <div className="space-y-1 sm:space-y-1.5">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-1.5 rounded bg-black/20 border border-white/5"
                    >
                      <SkeletonBase className="h-3 w-20 rounded" />
                      <SkeletonBase className="h-3 w-3 rounded" shimmer={false} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

ChampionEnhancementsGridSkeleton.displayName = 'ChampionEnhancementsGridSkeleton'
