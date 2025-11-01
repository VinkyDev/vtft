import type { AugmentLevelFilter } from './components'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { DataSkeleton, EmptyState } from '@/components'
import { useGameDataStore } from '@/store'
import { filterByPinyinSearch } from '@/utils/search'
import { getTierTextColor, groupAndSortByTier } from '@/utils/tier'
import { AugmentCard, AugmentFilter } from './components'

function AugmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<AugmentLevelFilter>('all')

  const { augments, augmentsLoading: loading } = useGameDataStore()

  const groupedAugments = useMemo(() => {
    if (!augments.length)
      return []

    let filteredAugments = augments

    if (levelFilter !== 'all') {
      filteredAugments = filteredAugments.filter(augment => augment.level === levelFilter)
    }

    filteredAugments = filterByPinyinSearch(
      filteredAugments,
      searchQuery,
      augment => augment.name,
    )

    return groupAndSortByTier(
      filteredAugments,
      augment => augment.tier || 'D',
      (a, b) => a.name.localeCompare(b.name),
    )
  }, [augments, searchQuery, levelFilter])

  const totalAugments = groupedAugments.reduce((sum, group) => sum + group.items.length, 0)

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <div className="py-1.5 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="搜索符文..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-6 sm:h-8 pl-7 pr-2 bg-black/20 border border-white/5 rounded text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
            />
          </div>
          <AugmentFilter
            levelFilter={levelFilter}
            onLevelFilterChange={setLevelFilter}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-110px)] sm:h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          <DataSkeleton
            loading={loading}
            isEmpty={totalAugments === 0}
            empty={<EmptyState message={searchQuery.trim() ? '未找到匹配的符文' : '暂无强化符文数据'} />}
          >
            <div className="space-y-4">
              {groupedAugments.map(({ tier, items }) => (
                <div key={tier}>
                  <div className="mb-2">
                    <h2 className={`text-sm font-bold ${getTierTextColor(tier)} border-b border-white/10 pb-1`}>
                      {tier}
                    </h2>
                  </div>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    }}
                  >
                    {items.map(augment => (
                      <AugmentCard key={`${augment.name}`} augment={augment} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DataSkeleton>
        </div>
      </ScrollArea>
    </div>
  )
}

export default AugmentsPage
