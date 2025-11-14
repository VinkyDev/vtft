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
      <div className="py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
        <SkeletonBase className="h-8 w-full" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-1.5 p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2.5"
            >
              <div className="flex items-center gap-2.5">
                <SkeletonBase className="h-12 w-12 rounded-md shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBase className="h-4 w-32 rounded" />
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <SkeletonBase key={j} className="h-3 w-3 rounded" shimmer={false} />
                    ))}
                  </div>
                </div>
                <SkeletonBase className="h-8 w-16 rounded shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

ItemsGridSkeleton.displayName = 'ItemsGridSkeleton'
