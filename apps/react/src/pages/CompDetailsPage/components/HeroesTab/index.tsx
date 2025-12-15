import type { CompItem } from 'types'
import type { ChampionData, ChampionItemEntry } from './types'
import { memo, useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { cn } from 'utils'
import { EmptyState, Item } from '@/components'
import { useMediaQuery } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { getItemCategory } from '@/utils/items'
import { BASE_ITEMS, calcRelativeScores, splitByImportance } from './helpers'
import { HeroRow } from './HeroRow'

export interface HeroesTabProps {
  items: CompItem[]
}

export const HeroesTab = memo(({ items }: HeroesTabProps) => {
  const itemsById = useGlobalStore(s => s.lookupsIndex.itemsById)
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const isSmUp = useMediaQuery('(min-width: 640px)', true)
  const [selectedBase, setSelectedBase] = useState<string | null>(null)

  const championsData = useMemo(() => {
    const championMap = new Map<string, {
      core: ChampionItemEntry[]
      artifact: ChampionItemEntry[]
      radiant: ChampionItemEntry[]
    }>()

    for (const item of items) {
      const category = getItemCategory(item.itemNames, itemsById)
      if (!category || category === 'emblem' || category === 'other')
        continue

      const itemMeta = itemsById[item.itemNames]
      const composition = (itemMeta?.composition ?? []).map(String)

      const units = item.units ?? []
      for (const unit of units) {
        if (!unit.units)
          continue

        if (!championMap.has(unit.units)) {
          championMap.set(unit.units, { core: [], artifact: [], radiant: [] })
        }

        const entry: ChampionItemEntry = {
          itemName: item.itemNames,
          count: unit.count ?? 0,
          avg: unit.avg ?? 4.5,
          importance: (unit.count ?? 0) * (4.5 - (unit.avg ?? 4.5)),
          relativeScore: 0,
          composition,
        }

        const data = championMap.get(unit.units)!
        if (category === 'core')
          data.core.push(entry)
        else if (category === 'artifact')
          data.artifact.push(entry)
        else if (category === 'radiant')
          data.radiant.push(entry)
      }
    }

    const result: ChampionData[] = []
    for (const [championId, data] of championMap) {
      if (!unitsById[championId])
        continue

      data.core.sort((a, b) => b.importance - a.importance)
      data.artifact.sort((a, b) => b.importance - a.importance)
      data.radiant.sort((a, b) => b.importance - a.importance)

      const { important: coreImportant, optional: coreOptional } = splitByImportance(data.core)
      const artifact = calcRelativeScores(data.artifact)
      const radiant = calcRelativeScores(data.radiant)

      const totalImportance = [...data.core, ...data.artifact, ...data.radiant]
        .reduce((sum, e) => sum + e.importance, 0)

      result.push({
        championId,
        totalImportance,
        coreImportant,
        coreOptional,
        artifact,
        radiant,
      })
    }

    return result.sort((a, b) => b.totalImportance - a.totalImportance)
  }, [items, itemsById, unitsById])

  if (championsData.length === 0) {
    return <EmptyState message="暂无英雄装备数据" />
  }

  const gridCols = isSmUp
    ? 'grid-cols-[44px_1fr_1fr_1fr_1fr]'
    : 'grid-cols-[40px_1fr_1fr]'

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 py-2 mb-1 bg-white/5 rounded-lg border border-white/10">
        <div className={cn('grid gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 font-medium items-center', gridCols)}>
          <div className="text-center">弈子</div>
          <div className="text-center">重要</div>
          <div className="text-center">可选</div>
          {isSmUp && <div className="text-center">神器</div>}
          {isSmUp && <div className="text-center">光明</div>}
        </div>

        <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-white/10">
          {BASE_ITEMS.map(baseId => (
            <button
              key={baseId}
              type="button"
              onClick={() => setSelectedBase(selectedBase === baseId ? null : baseId)}
              className={cn(
                'rounded transition-all',
                selectedBase === baseId
                  ? 'ring-2 ring-blue-500 bg-blue-500/20'
                  : 'opacity-50 hover:opacity-100',
              )}
            >
              <Item id={baseId} className="size-5 sm:size-6" showTooltip />
            </button>
          ))}
          {selectedBase && (
            <button
              type="button"
              onClick={() => setSelectedBase(null)}
              className="ml-1 text-[10px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-130px)] sm:h-[calc(100vh-145px)]">
        <div className="flex flex-col gap-1">
          {championsData.map(champion => (
            <HeroRow
              key={champion.championId}
              data={champion}
              isSmUp={isSmUp}
              selectedBase={selectedBase}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

HeroesTab.displayName = 'HeroesTab'
