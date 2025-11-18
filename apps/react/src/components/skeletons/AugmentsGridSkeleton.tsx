/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface AugmentsGridSkeletonProps {
  /** 容器类名 */
  className?: string
}

/** 符文列表骨架屏 */
export const AugmentsGridSkeleton = memo(({ className = '' }: AugmentsGridSkeletonProps) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/[0.02] p-2"
              >
                <div className="flex justify-center mb-2">
                  <SkeletonBase className="h-8 w-8 rounded border border-white/10" />
                </div>
                <SkeletonBase className="h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

AugmentsGridSkeleton.displayName = 'AugmentsGridSkeleton'
