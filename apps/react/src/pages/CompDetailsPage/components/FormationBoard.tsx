/* eslint-disable react/no-array-index-key */
import type { Build, CompDetail, FinalLevel } from 'types'
import { find, orderBy, take } from 'lodash-es'
import { memo, useMemo, useState } from 'react'
import { Trait } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { FormationCell } from './FormationCell'

/** 等级分布指示器 */
const LevelIndicator = memo(({ levels }: { levels: FinalLevel[] }) => {
  // 按使用次数排序，取前3个最热门的等级，并计算百分比
  const topLevels = useMemo(() => {
    const totalCount = levels.reduce((sum, l) => sum + (l.count ?? 0), 0)
    const sorted = orderBy(levels, ['count'], ['desc'])
    return take(sorted, 3).map(item => ({
      ...item,
      percent: totalCount > 0 ? ((item.count ?? 0) / totalCount * 100).toFixed(0) : '0',
    }))
  }, [levels])

  if (topLevels.length === 0)
    return null

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="hidden sm:inline text-zinc-500">常见等级</span>
      <div className="flex items-center gap-1.5">
        {topLevels.map((item, idx) => (
          <div
            key={item.level}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
              idx === 0
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-zinc-700/50 text-zinc-300'
            }`}
          >
            <span className="font-medium">
              Lv
              {item.level}
            </span>
            <span className="text-[10px] opacity-70">
              {item.percent}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})

LevelIndicator.displayName = 'LevelIndicator'

interface FormationBoardProps {
  data: CompDetail
  builds?: Build[]
  traits?: string[]
}

// 创建 7列 x 4行 的棋盘网格
const ROWS = 4
const COLS = 7

function getRowCol(n: number) {
  if (n < 1 || n > 28) {
    throw new Error('数字必须在 1 到 28 之间')
  }
  const row = 4 - Math.floor((n - 1) / 7) - 1
  const col = (n - 1) % 7
  return { row, col }
}

/**
 * 阵容站位棋盘组件
 * 展示 7x4 的云顶之弈六边形棋盘布局
 */
export const FormationBoard = memo(({ data, builds, traits }: FormationBoardProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)

  const positioning = useMemo(() => data?.positioning || [], [data])

  const board = useMemo(() => {
    const grid: Array<Array<typeof positioning[0] | null>> = Array.from(
      { length: ROWS },
      () => Array.from({ length: COLS }, () => null),
    )

    positioning.forEach((position) => {
      if (!position.position)
        return
      const { row, col } = getRowCol(position.position)
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        grid[row]![col] = position
      }
    })

    return grid
  }, [positioning])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-1 sm:p-4 gap-1">
      {/* 等级分布 */}
      {data?.final_level && data.final_level.length > 0 && (
        <LevelIndicator levels={data.final_level} />
      )}
      <div className="flex items-center justify-center">
        <div className="p-1 sm:p-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            {board.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1 sm:gap-2"
                style={{
                  // 第2,4行(索引1,3)向右错开半格距离
                  marginLeft: rowIndex % 2 === 1 ? 'calc(min(4.25vw, 2rem))' : '0',
                }}
              >
                {row.map((position, colIndex) => {
                  const unitId = position?.unit || ''
                  const unitMeta = unitsById[unitId]
                  const hoveredTraitName = hoveredTrait ? traitsById[hoveredTrait]?.name : undefined
                  const hasTrait = hoveredTraitName ? unitMeta?.traits?.includes(hoveredTraitName) : false
                  const isHighlighted = !!hoveredTrait && !!position?.unit && !!hasTrait
                  const isDimmed = !!hoveredTrait && !!position?.unit && !hasTrait
                  return (
                    <FormationCell
                      key={`${rowIndex}-${colIndex}`}
                      champion={position?.unit}
                      items={find(builds || [], { unit: position?.unit })?.buildName || []}
                      isHighlighted={isHighlighted}
                      isDimmed={isDimmed}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 羁绊信息 */}
      {traits && traits?.length > 0 && (
        <div className="w-full px-2">
          <div className="flex flex-wrap gap-0.5 sm:gap-2 items-center justify-center">
            {traits?.map(traitId => (
              <div
                key={traitId}
                onMouseEnter={() => {
                  const parts = traitId.split('_')
                  const last = parts[parts.length - 1]
                  const apiName = /^\d+$/.test(last ?? '') ? parts.slice(0, -1).join('_') : traitId
                  setHoveredTrait(apiName)
                }}
                onMouseLeave={() => setHoveredTrait(null)}
              >
                <Trait id={traitId} variant="with-label" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

FormationBoard.displayName = 'FormationBoard'
