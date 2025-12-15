import type { ChampionData } from './types'
import { memo } from 'react'
import { cn } from 'utils'
import { Champion } from '@/components'
import { ChampionName } from './ChampionName'
import { ItemColumn } from './ItemColumn'

interface HeroRowProps {
  data: ChampionData
  isSmUp: boolean
  selectedBase: string | null
}

export const HeroRow = memo(({ data, isSmUp, selectedBase }: HeroRowProps) => {
  const gridCols = isSmUp
    ? 'grid-cols-[44px_1fr_1fr_1fr_1fr]'
    : 'grid-cols-[40px_1fr_1fr]'

  return (
    <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-md py-2 px-1 border border-white/10 hover:border-blue-500/30 transition-colors min-h-[52px] sm:min-h-[60px]">
      <div className={cn('grid gap-1 sm:gap-2 items-center h-full', gridCols)}>
        <div className="flex flex-col items-center justify-center overflow-hidden">
          <Champion
            id={data.championId}
            showTooltip
            className="size-6 sm:size-7 shrink-0"
          />
          <ChampionName id={data.championId} />
        </div>

        <ItemColumn items={data.coreImportant} maxShow={4} selectedBase={selectedBase} />
        <ItemColumn items={data.coreOptional} maxShow={4} selectedBase={selectedBase} />
        {isSmUp && <ItemColumn items={data.artifact} maxShow={4} />}
        {isSmUp && <ItemColumn items={data.radiant} maxShow={4} />}
      </div>
    </div>
  )
})

HeroRow.displayName = 'HeroRow'
