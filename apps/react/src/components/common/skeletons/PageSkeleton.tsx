import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface PageSkeletonProps {
  /** 是否显示过滤器骨架 */
  showFilter?: boolean
  /** 卡片数量 */
  cardCount?: number
  /** 容器类名 */
  className?: string
}

/** 页面骨架屏 */
export const PageSkeleton = memo(({ showFilter = true, cardCount = 8, className = '' }: PageSkeletonProps) => {
  return (
    <div className={`flex flex-col gap-1.5 px-2 ${className}`}>
      {showFilter && (
        <div className="py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
          <SkeletonBase className="h-8 w-full" />
        </div>
      )}
      <div className="pb-2">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          }}
        >
          {Array.from({ length: cardCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="relative overflow-hidden h-20 w-20 rounded-md border-2 border-white/20 bg-gradient-to-br from-gray-700/50 to-gray-800/50">
                <div className="absolute inset-0 animate-skeleton-pulse bg-white/15" />
              </div>
              <SkeletonBase className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

PageSkeleton.displayName = 'PageSkeleton'
