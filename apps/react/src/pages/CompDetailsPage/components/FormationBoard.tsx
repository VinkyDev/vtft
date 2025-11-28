/* eslint-disable react/no-array-index-key */
import type { Build, CompDetail } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo, useState } from 'react'
import { Trait } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { FormationCell } from './FormationCell'

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
  const { lookupsIndex } = useGlobalStore()
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
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-1">
      <div className="flex items-center justify-center">
        <div className="p-3 sm:p-5">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {board.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1.5 sm:gap-2"
                style={{
                  // 第2,4行(索引1,3)向右错开半格距离
                  marginLeft: rowIndex % 2 === 1 ? 'calc(min(4.5vw, 2.25rem))' : '0',
                }}
              >
                {row.map((position, colIndex) => {
                  const unitId = position?.unit || ''
                  const unitMeta = lookupsIndex.unitsById[unitId]
                  const hoveredTraitName = hoveredTrait ? lookupsIndex.traitsById[hoveredTrait]?.name : undefined
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
