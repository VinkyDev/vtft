/* eslint-disable react/no-array-index-key */
import type { Build, CompDetail } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo, useState } from 'react'
import { CopyButton, Trait } from '@/components'
import { useUnitsUtils } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { FormationCell } from './FormationCell'
import { COLS, getRowCol, ROWS } from './helpers'
import { LevelIndicator } from './LevelIndicator'

export interface OverviewTabProps {
  data: CompDetail
  builds?: Build[]
  traits?: string[]
}

export const OverviewTab = memo(({ data, builds, traits }: OverviewTabProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)
  const [hoveredTrait, setHoveredTrait] = useState<string | null>(null)
  const { generateCompCode } = useUnitsUtils()

  const positioning = useMemo(() => data?.positioning || [], [data])

  const compCode = useMemo(() => {
    if (!positioning || positioning.length === 0)
      return ''

    const unitIds: string[] = []
    positioning.forEach((pos) => {
      if (pos.unit && !unitIds.includes(pos.unit)) {
        unitIds.push(pos.unit)
      }
    })

    if (unitIds.length === 0)
      return ''

    return generateCompCode(unitIds)
  }, [positioning, generateCompCode])

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
      {data?.final_level && data.final_level.length > 0 && (
        <div className="flex items-center justify-between w-full max-w-xl px-2">
          <LevelIndicator levels={data.final_level} />
          {compCode && (
            <CopyButton
              text={compCode}
              label="代码"
              className="rounded bg-white/5 px-2 py-1 text-[11px] text-zinc-300 hover:bg-white/10"
              iconClassName="size-3.5"
            />
          )}
        </div>
      )}
      <div className="flex items-center justify-center">
        <div className="p-1 sm:p-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            {board.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-1 sm:gap-2"
                style={{
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

OverviewTab.displayName = 'OverviewTab'
