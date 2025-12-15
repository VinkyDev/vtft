import type { ChampionItemEntry } from './types'
import { memo } from 'react'
import { cn } from 'utils'
import { Item } from '@/components'
import { getImportanceColor } from './helpers'

interface ItemColumnProps {
  items: ChampionItemEntry[]
  maxShow: number
  selectedBase?: string | null
}

export const ItemColumn = memo(({ items, maxShow, selectedBase }: ItemColumnProps) => {
  const displayItems = items.slice(0, maxShow)

  if (displayItems.length === 0) {
    return <div className="flex items-center justify-center text-gray-600 text-[10px] h-full">—</div>
  }

  return (
    <div className="flex items-center justify-center gap-0.5 sm:gap-1 flex-wrap h-full">
      {displayItems.map((entry, idx) => {
        const isHighlighted = selectedBase && entry.composition.includes(selectedBase)
        const isDimmed = selectedBase && !isHighlighted

        return (
          <div
            key={`${entry.itemName}-${idx}`}
            className={cn(
              'flex flex-col items-center transition-opacity',
              isDimmed && 'opacity-30',
              isHighlighted && 'ring-1 ring-blue-500/60 rounded',
            )}
          >
            <Item
              id={entry.itemName}
              showTooltip={false}
              className="size-5 sm:size-6"
            />
            <span
              className="text-[7px] sm:text-[8px] font-medium tabular-nums leading-tight"
              style={{ color: getImportanceColor(entry.relativeScore) }}
            >
              {entry.relativeScore.toFixed(2)}
            </span>
          </div>
        )
      })}
    </div>
  )
})

ItemColumn.displayName = 'ItemColumn'
