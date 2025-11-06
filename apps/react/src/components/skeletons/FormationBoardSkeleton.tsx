import { memo } from 'react'

interface FormationBoardSkeletonProps {
  /** 容器类名 */
  className?: string
}

/** 阵容站位棋盘骨架屏 */
export const FormationBoardSkeleton = memo(({ className = '' }: FormationBoardSkeletonProps) => {
  const ROWS = 4
  const COLS = 7
  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

  return (
    <div className={`flex items-center justify-center h-full w-full p-4 ${className}`}>
      <div className="flex items-center justify-center">
        <div className="p-3 sm:p-5">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {Array.from({ length: ROWS }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1.5 sm:gap-2"
                style={{
                  marginLeft: rowIndex % 2 === 1 ? 'calc(min(4.5vw, 2.25rem))' : '0',
                }}
              >
                {Array.from({ length: COLS }).map((_, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="relative"
                    style={{
                      width: 'min(9vw, 4.5rem)',
                      height: 'min(10.5vw, 5.25rem)',
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
                        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"
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
    </div>
  )
})

FormationBoardSkeleton.displayName = 'FormationBoardSkeleton'
