import type { Formation } from 'types'
import { memo, useMemo } from 'react'
import { useGameDataStore } from '@/store'

interface FormationCellProps {
  position: Formation['positions'][0] | null
  rowIndex: number
  colIndex: number
}

/** 根据费用获取颜色 */
function getCostColor(cost: number) {
  switch (cost) {
    case 1:
      return 'rgba(107, 114, 128, 1)' // gray-500
    case 2:
      return 'rgba(34, 197, 94, 1)' // green-500
    case 3:
      return 'rgba(59, 130, 246, 1)' // blue-500
    case 4:
      return 'rgba(168, 85, 247, 1)' // purple-500
    case 5:
      return 'rgba(234, 179, 8, 1)' // yellow-500
    default:
      return 'rgba(107, 114, 128, 1)' // gray-500
  }
}

/**
 * 棋盘格子组件 - 六边形样式
 * 展示单个位置上的英雄及其装备
 */
export const FormationCell = memo(({ position, rowIndex: _rowIndex, colIndex: _colIndex }: FormationCellProps) => {
  const champion = position?.champion
  const { champions } = useGameDataStore()

  // 从 store 获取完整的英雄数据以获得 cost
  const championMeta = useMemo(() => {
    if (!champion)
      return null
    return champions.find(c => c.name === champion.name)
  }, [champions, champion])

  // 六边形 clip-path
  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

  // 空格子
  if (!champion) {
    return (
      <div
        className="relative"
        style={{
          width: 'min(9vw, 4.5rem)',
          height: 'min(10.5vw, 5.25rem)',
        }}
      >
        {/* 六边形背景 */}
        <div
          className="absolute inset-0 bg-white/5"
          style={{ clipPath: hexagonClipPath }}
        />
      </div>
    )
  }

  const borderColor = getCostColor(championMeta?.cost || 1)

  return (
    <div
      className="relative"
      style={{
        width: 'min(9vw, 4.5rem)',
        height: 'min(10.5vw, 5.25rem)',
      }}
    >
      {/* 六边形边框层（使用背景色作为边框） */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: hexagonClipPath,
          backgroundColor: borderColor,
        }}
      />

      {/* 六边形内容层（比外层小一点，露出边框） */}
      <div
        className="absolute overflow-hidden"
        style={{
          clipPath: hexagonClipPath,
          top: '2px',
          left: '2px',
          right: '2px',
          bottom: '2px',
        }}
      >
        {/* 英雄图标 */}
        <img
          src={champion.icon}
          alt={champion.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 星级标识 - 只显示三星 */}
      {champion.stars === 3 && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: champion.stars }).map((_, i) => (
              <svg
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.9)]"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      )}

      {/* 英雄名称 - 中间偏下 */}
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-10">
        <div
          className="text-white text-[8px] sm:text-[10px] font-bold px-1 whitespace-nowrap"
          style={{
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}
        >
          {champion.name}
        </div>
      </div>

      {/* 装备显示 - 英雄下侧 */}
      {champion.items && champion.items.length > 0 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 flex">
          {champion.items.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-black/80 overflow-hidden border border-white/30"
              title={item.name}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

FormationCell.displayName = 'FormationCell'
