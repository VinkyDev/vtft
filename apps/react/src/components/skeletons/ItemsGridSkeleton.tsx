import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface ItemsGridSkeletonProps {
  /** 容器类名 */
  className?: string
}

/** 装备列表骨架屏 */
export const ItemsGridSkeleton = memo(({ className = '' }: ItemsGridSkeletonProps) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* FilterBar 骨架屏 */}
      <div className="py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10 mx-1">
        <div className="flex justify-between items-center flex-wrap gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <SkeletonBase className="h-6 sm:h-8 w-20 sm:w-24 rounded" shimmer={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-1.5 p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-md p-1.5 border border-white/10"
            >
              <div className="grid grid-cols-[30px_2fr_2fr_3fr] sm:grid-cols-[180px_2fr_4fr_3fr] gap-2 items-center pl-2">
                {/* 装备图标和名称 */}
                <div className="flex justify-start items-center gap-2">
                  <SkeletonBase className="h-6 w-6 rounded shrink-0" shimmer={false} />
                  <SkeletonBase className="hidden sm:block h-3 w-20 rounded" shimmer={false} />
                </div>
                {/* 组件图标 */}
                <div className="flex items-center gap-1 justify-center">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <SkeletonBase key={j} className="h-4 sm:h-5 w-4 sm:w-5 rounded" shimmer={false} />
                  ))}
                </div>
                {/* 影响值 */}
                <div className="flex items-center gap-1 justify-self-center">
                  <SkeletonBase className="h-3 w-8 rounded" shimmer={false} />
                  <SkeletonBase className="h-3 w-10 rounded" shimmer={false} />
                </div>
                {/* 推荐英雄 */}
                <div className="flex items-center gap-1 min-w-0 justify-end">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <SkeletonBase key={j} className="h-4 sm:h-5 w-4 sm:w-5 rounded" shimmer={false} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

ItemsGridSkeleton.displayName = 'ItemsGridSkeleton'
