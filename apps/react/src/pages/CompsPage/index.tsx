import type { FilterGroup } from '@/components'
import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { getComps } from 'api-client'
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { cn, matchPinyinSearch } from 'utils'
import { VList } from 'virtua'
import { CompPageSkeleton, FilterBar, SearchInput } from '@/components'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useGlobalStore } from '@/store/globalStore'
import { processComps } from '@/utils/compRating'
import CompDetailPage from '../CompDetailsPage'
import { CompCard, LowPickrateAccordion } from './components'

type SortField = 'composite' | 'rank' | 'matches'
type VirtualItem
  = | { type: 'comp', comp: EnhancedCompData }
    | { type: 'accordion', comps: EnhancedCompData[], tier: string }

function flattenGroupsToVirtualItems(groups: GroupedComps[]): VirtualItem[] {
  const items: VirtualItem[] = []
  for (const group of groups) {
    for (const comp of group.normal) {
      items.push({ type: 'comp', comp })
    }
    if (group.lowPickrate.length > 0) {
      items.push({ type: 'accordion', comps: group.lowPickrate, tier: group.tier })
    }
  }
  return items
}

function CompRankingsPage() {
  const season = useGlobalStore(s => s.curSeason)
  const globalLoading = useGlobalStore(s => s.loading)
  const favorites = useFavoritesStore(s => s.favorites)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('composite')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const effectiveShowFavoritesOnly = showFavoritesOnly && favorites.size > 0

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

    const matchComp = (comp: EnhancedCompData) => {
      if (effectiveShowFavoritesOnly && (!comp.compId || !favorites.has(comp.compId)))
        return false
      if (!query)
        return true
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
  }, [groupedComps, searchQuery, unitsById, traitsById, effectiveShowFavoritesOnly, favorites])

  const virtualItems = useMemo(
    () => flattenGroupsToVirtualItems(filteredGroupedComps),
    [filteredGroupedComps],
  )

  const [selectedComp, setSelectedComp] = useState<EnhancedCompData | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)

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
        { value: 'matches', label: '登场' },
      ],
      onChange: value => setSortField(value as SortField),
    },
  ]

  return (
    <>
      <div className="flex h-full flex-col gap-1.5 px-2">
        <div className="mb-1 shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="搜索英雄/羁绊..."
              onSearchChange={setSearchQuery}
            />
            <FilterBar groups={filterGroups} showContainer={false} />
            {favorites.size > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={cn(
                      'shrink-0 rounded-md p-1 sm:p-1.5 transition-colors',
                      showFavoritesOnly
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-gray-400 hover:bg-white/10 hover:text-gray-200',
                    )}
                  >
                    <Star className={cn('size-3.5 sm:size-4', showFavoritesOnly && 'fill-current')} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                  {showFavoritesOnly ? '显示全部阵容' : '仅显示收藏'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {loading || globalLoading
          ? (
              <CompPageSkeleton />
            )
          : (
              <VList
                className={cn(
                  'virtual-scrollbar min-h-0 flex-1',
                  isScrolling && 'is-scrolling',
                )}
                onScroll={() => setIsScrolling(true)}
                onScrollEnd={() => setIsScrolling(false)}
              >
                {virtualItems.map((item, index) => (
                  <div key={item.type === 'comp' ? item.comp.id : `accordion-${item.tier}-${index}`} className="pb-1.5">
                    {item.type === 'comp'
                      ? (
                          <CompCard comp={item.comp} onClick={handleCompClick} />
                        )
                      : (
                          <LowPickrateAccordion comps={item.comps} onCompClick={handleCompClick} />
                        )}
                  </div>
                ))}
              </VList>
            )}
      </div>

      <CompDetailPage key={selectedComp?.compId} comp={selectedComp} onClose={handleCloseDetail} />
    </>
  )
}

export default CompRankingsPage
