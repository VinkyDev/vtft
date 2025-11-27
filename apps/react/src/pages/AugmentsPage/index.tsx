import type { AugmentLevelFilter } from './components'
import { getAugments } from 'api-client'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { ScrollArea } from 'ui/components'
import { filterByPinyinSearch } from 'utils'
import { DataSkeleton, EmptyState } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { getLevelFromIcon } from '@/utils/getter'
import { getTierTextColor } from '@/utils/tier'
import { AugmentCard, AugmentFilter } from './components'

function AugmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<AugmentLevelFilter>('all')

  const { data: tierList, loading } = useRequest(
    async () => {
      const { data } = await getAugments()
      return data
    },
    {
      cacheKey: 'augments',
      staleTime: 60_000,
    },
  )

  const augmentsById = useGlobalStore(s => s.lookupsIndex.augmentsById)
  const filteredTierList = useMemo(() => {
    if (!tierList?.length)
      return []
    return tierList.map((group) => {
      let content = group.content ?? []
      if (searchQuery.trim()) {
        content = filterByPinyinSearch(content, searchQuery.trim(), item => String(augmentsById[item.id!]?.name ?? ''))
      }
      if (levelFilter !== 'all') {
        content = content.filter((item) => {
          const icon = augmentsById[item.id!]?.icon
          return getLevelFromIcon(icon) === levelFilter
        })
      }
      return { ...group, content }
    }).filter(group => (group.content?.length ?? 0) > 0)
  }, [tierList, searchQuery, levelFilter, augmentsById])

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
            isEmpty={filteredTierList.length === 0}
            empty={<EmptyState message={searchQuery.trim() ? '未找到匹配的符文' : '暂无强化符文数据'} />}
          >
            <div className="space-y-4">
              {filteredTierList.map(({ content, label }) => (
                <div key={label}>
                  <div className="mb-2">
                    <h2 className={`text-sm font-bold ${getTierTextColor(label!)} border-b border-white/10 pb-1`}>
                      {label}
                    </h2>
                  </div>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: (content && content.length < 3)
                        ? 'repeat(3, minmax(80px, 1fr))'
                        : 'repeat(auto-fit, minmax(80px, 1fr))',
                    }}
                  >
                    {content?.map(augment => (
                      <AugmentCard key={augment.id} id={augment.id} />
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
