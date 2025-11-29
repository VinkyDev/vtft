/* eslint-disable react/no-array-index-key */
import { memo } from 'react'
import { SkeletonBase } from './SkeletonBase'

interface FormationBoardSkeletonProps {
  /** 容器类名 */
  className?: string
}

/** 阵容站位棋盘骨架屏 */
export const FormationBoardSkeleton = memo(({ className = '' }: FormationBoardSkeletonProps) => {
  const ROWS = 4
  const COLS = 7
  const TRAITS_COUNT = 5 // 羁绊数量骨架屏
  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

  return (
    <div className={`flex flex-col items-center justify-center h-full w-full p-1 sm:p-4 gap-1 ${className}`}>
      {/* 等级分布骨架屏 */}
      <div className="flex items-center gap-2 text-xs">
        <SkeletonBase className="h-4 w-16 rounded" shimmer={false} />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBase key={idx} className="h-5 w-12 rounded" shimmer={false} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="p-1 sm:p-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1 sm:gap-2"
                style={{
                  marginLeft: rowIndex % 2 === 1 ? 'calc(min(4.25vw, 2rem))' : '0',
                }}
              >
                {Array.from({ length: COLS }).map((_, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative"
                    style={{
                      width: 'min(8.5vw, 4rem)',
                      height: 'min(9.8vw, 4.6rem)',
                    }}
                  >
                    {/* 六边形背景 */}
                    <div
                      className="absolute inset-0"
                      style={{ clipPath: hexagonClipPath }}
                    >
                      <div className="absolute inset-0 bg-white/10 animate-skeleton-pulse" />
                    </div>
                    {/* Shimmer 动画层 */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: hexagonClipPath }}
                    >
                      <div
                        className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/30 to-transparent blur-sm"
                        style={{ animationDelay: `${(rowIndex * COLS + colIndex) * 0.05}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 羁绊信息骨架屏 */}
      <div className="w-full px-2">
        <div className="flex flex-wrap gap-0.5 sm:gap-2 items-center justify-center">
          {Array.from({ length: TRAITS_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="animate-skeleton-pulse"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* 小屏幕版本 */}
              <div className="sm:hidden h-5 w-5 rounded border border-white/10 bg-white/10" />
              {/* 正常屏幕版本 */}
              <div className="hidden sm:block h-7 w-24 rounded border border-white/10 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

FormationBoardSkeleton.displayName = 'FormationBoardSkeleton'
