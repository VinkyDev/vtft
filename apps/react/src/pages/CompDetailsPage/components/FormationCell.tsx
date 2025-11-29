import { memo } from 'react'
import { Champion } from '@/components/game/Champion'
import { useGlobalStore } from '@/store/globalStore'
import { getChampionCostColor } from '@/utils/styles'

interface FormationCellProps {
  champion: string | undefined
  items?: string[]
  /** 是否高亮显示（当 hover 羁绊时，拥有该羁绊的英雄高亮） */
  isHighlighted?: boolean
  /** 是否暗淡显示（当 hover 羁绊时，不拥有该羁绊的英雄暗淡） */
  isDimmed?: boolean
}
// 六边形 clip-path
const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

/**
 * 棋盘格子组件 - 六边形样式
 * 展示单个位置上的英雄及其装备
 */
export const FormationCell = memo(({ champion, items, isHighlighted = false, isDimmed = false }: FormationCellProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const championMeta = unitsById[champion || '']

  // 空格子
  if (!champion) {
    return (
      <div
        className="relative"
        style={{
          width: 'min(8.5vw, 4rem)',
          height: 'min(9.8vw, 4.6rem)',
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

  const { bg } = getChampionCostColor(championMeta?.cost || 1)

  return (
    <div
      className={`relative transition-all duration-200 ${isHighlighted ? 'scale-110 z-10' : ''} ${isDimmed ? 'opacity-30' : ''}`}
      style={{
        width: 'min(8.5vw, 4rem)',
        height: 'min(9.8vw, 4.6rem)',
      }}
    >
      {/* 高亮光晕效果 */}
      {isHighlighted && (
        <div
          className={`absolute -inset-1 animate-pulse blur-sm opacity-50 ${bg}`}
          style={{ clipPath: hexagonClipPath }}
        />
      )}

      {/* 六边形边框层（使用背景色作为边框） */}
      <div
        className={`absolute inset-0 ${bg}`}
        style={{ clipPath: hexagonClipPath }}
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
          nameClassName="hidden sm:block sm:text-[12px] -bottom-4"
          itemClassName="sm:size-4 size-2.5"
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
