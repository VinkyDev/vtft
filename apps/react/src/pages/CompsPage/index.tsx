import type { FilterGroup } from '@/components'
import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { getComps } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { ScrollArea } from 'ui'
import { matchPinyinSearch } from 'utils'
import { CompPageSkeleton, FilterBar, SearchInput } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { processComps } from '@/utils/compRating'
import CompDetailPage from '../CompDetailsPage'
import { TierSection } from './components'

type SortField = 'composite' | 'rank' | 'matches'

function CompRankingsPage() {
  const season = useGlobalStore(s => s.curSeason)
  const globalLoading = useGlobalStore(s => s.loading)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('composite')

  const { data, loading } = useRequest(
    async () => {
      const res = await getComps({ season })
      return res.data
    },
    {
      cacheKey: `comps:${season}`,
      staleTime: 60_000,
      refreshDeps: [season],
      ready: Boolean(season),
    },
  )

  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const traitsById = useGlobalStore(s => s.lookupsIndex.traitsById)

  const groupedComps = useMemo<GroupedComps[]>(() => {
    if (!data)
      return []
    return processComps(data, sortField)
  }, [data, sortField])

  const filteredGroupedComps = useMemo<GroupedComps[]>(() => {
    const query = searchQuery.trim()
    if (!query)
      return groupedComps

    const matchComp = (comp: EnhancedCompData) => {
      const unitNames = (comp.units ?? []).map(u => unitsById[u]?.name ?? '')
      const traitNames = (comp.traits ?? []).map((t) => {
        const traitKey = t.replace(/_\d+$/, '')
        return traitsById[traitKey]?.name ?? ''
      })
      const allNames = [...unitNames, ...traitNames]
      return allNames.some(name => matchPinyinSearch(name, query))
    }

    return groupedComps
      .map(group => ({
        ...group,
        normal: group.normal.filter(matchComp),
        lowPickrate: group.lowPickrate.filter(matchComp),
      }))
      .filter(group => group.normal.length > 0 || group.lowPickrate.length > 0)
  }, [groupedComps, searchQuery, unitsById, traitsById])

  const [selectedComp, setSelectedComp] = useState<EnhancedCompData | null>(null)

  const handleCompClick = (comp: EnhancedCompData) => {
    setSelectedComp(comp)
  }

  const handleCloseDetail = () => {
    setSelectedComp(null)
  }

  const filterGroups: FilterGroup[] = [
    {
      value: sortField,
      options: [
        { value: 'composite', label: '综合' },
        { value: 'rank', label: '排名' },
        { value: 'matches', label: '场次' },
      ],
      onChange: value => setSortField(value as SortField),
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-1.5 px-2">
        <div className="py-1.5 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
          <div className="flex gap-2 items-center">
            <SearchInput
              placeholder="搜索英雄/羁绊..."
              onSearchChange={setSearchQuery}
            />
            <FilterBar groups={filterGroups} showContainer={false} />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-110px)] sm:h-[calc(100vh-120px)]" type="scroll">
          {loading || globalLoading
            ? (
                <CompPageSkeleton />
              )
            : (
                <div className="flex flex-col gap-1.5">
                  {filteredGroupedComps.map(group => (
                    <TierSection key={group.tier} group={group} onCompClick={handleCompClick} />
                  ))}
                </div>
              )}
        </ScrollArea>
      </div>

      <CompDetailPage key={selectedComp?.compId} comp={selectedComp} onClose={handleCloseDetail} />
    </>
  )
}

export default CompRankingsPage
