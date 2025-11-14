import type { Formation, Trait as TraitMeta } from 'types'
import { memo, useMemo } from 'react'
import { Trait } from '@/components'
import { FormationCell } from './FormationCell'

interface FormationBoardProps {
  formation: Formation
  traits?: TraitMeta[]
}

/**
 * 阵容站位棋盘组件
 * 展示 7x4 的云顶之弈六边形棋盘布局
 */
export const FormationBoard = memo(({ formation, traits }: FormationBoardProps) => {
  // 创建 7列 x 4行 的棋盘网格
  const ROWS = 4
  const COLS = 7

  // 将 positions 转换为二维数组以便渲染
  const board: Array<Array<typeof formation.positions[0] | null>> = Array.from(
    { length: ROWS },
    () => Array.from({ length: COLS }, () => null),
  )

  // 填充棋盘数据
  formation.positions.forEach((position) => {
    if (position.row >= 0 && position.row < ROWS && position.col >= 0 && position.col < COLS) {
      board[position.row][position.col] = position
    }
  })

  // 按照 count 降序排序羁绊
  const sortedTraits = useMemo(() => {
    if (!traits)
      return []
    return [...traits].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  }, [traits])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-1">
      <div className="flex items-center justify-center">
        {/* 棋盘 - 使用响应式尺寸 */}
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
                {row.map((position, colIndex) => (
                  <FormationCell
                    key={`${rowIndex}-${colIndex}`}
                    position={position}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 羁绊信息 */}
      {sortedTraits.length > 0 && (
        <div className="w-full px-2">
          <div className="flex flex-wrap gap-0.5 sm:gap-2 items-center justify-center">
            {sortedTraits.map((trait, idx) => (
              <Trait key={idx} trait={trait} variant="with-label" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

FormationBoard.displayName = 'FormationBoard'
