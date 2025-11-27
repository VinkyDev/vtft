import { memo } from 'react'
import { Champion } from '@/components/game/Champion'
import { useGlobalStore } from '@/store/globalStore'

interface FormationCellProps {
  champion: string | undefined
  items?: string[]
  /** 是否高亮显示（当 hover 羁绊时，拥有该羁绊的英雄高亮） */
  isHighlighted?: boolean
  /** 是否暗淡显示（当 hover 羁绊时，不拥有该羁绊的英雄暗淡） */
  isDimmed?: boolean
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
// 六边形 clip-path
const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

/**
 * 棋盘格子组件 - 六边形样式
 * 展示单个位置上的英雄及其装备
 */
export const FormationCell = memo(({ champion, items, isHighlighted = false, isDimmed = false }: FormationCellProps) => {
  const { lookupsIndex } = useGlobalStore()
  const championMeta = lookupsIndex.unitsById[champion || '']

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
      className={`relative transition-all duration-200 ${isHighlighted ? 'scale-110 z-10' : ''} ${isDimmed ? 'opacity-30' : ''}`}
      style={{
        width: 'min(9vw, 4.5rem)',
        height: 'min(10.5vw, 5.25rem)',
      }}
    >
      {/* 高亮光晕效果 */}
      {isHighlighted && (
        <div
          className="absolute -inset-1 animate-pulse"
          style={{
            clipPath: hexagonClipPath,
            backgroundColor: borderColor,
            opacity: 0.5,
            filter: 'blur(4px)',
          }}
        />
      )}

      {/* 六边形边框层（使用背景色作为边框） */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: hexagonClipPath,
          backgroundColor: borderColor,
        }}
      />

      {/* 六边形内容层 */}
      <div
        className="absolute"
        style={{
          top: '2px',
          left: '2px',
          right: '2px',
          bottom: '2px',
        }}
      >
        <Champion
          id={champion}
          showName
          items={items}
          className="w-full h-full border-0 rounded-none bg-transparent"
          style={{ clipPath: hexagonClipPath }}
          wrapperClassName="relative w-full h-full justify-center"
        />
      </div>
    </div>
  )
})

FormationCell.displayName = 'FormationCell'
