import type { FilterGroup } from '@/components'
import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { getComps } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { cn, matchPinyinSearch } from 'utils'
import { VList } from 'virtua'
import { CompPageSkeleton, FilterBar, SearchInput } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { processComps } from '@/utils/compRating'
import CompDetailPage from '../CompDetailsPage'
import { CompCard, LowPickrateAccordion } from './components'

type SortField = 'composite' | 'rank' | 'matches'

/**
 * 虚拟列表项类型
 * - comp: 普通阵容卡片
 * - accordion: 低出场率阵容折叠面板
 */
type VirtualItem
  = | { type: 'comp', comp: EnhancedCompData }
    | { type: 'accordion', comps: EnhancedCompData[], tier: string }

/**
 * 将分组数据扁平化为虚拟列表项
 * 保持原有的 UI 结构：普通阵容直接渲染，低出场率阵容在折叠面板中
 */
function flattenGroupsToVirtualItems(groups: GroupedComps[]): VirtualItem[] {
  const items: VirtualItem[] = []

  for (const group of groups) {
    // 添加普通阵容
    for (const comp of group.normal) {
      items.push({ type: 'comp', comp })
    }

    // 添加低出场率阵容折叠面板（作为一个整体项）
    if (group.lowPickrate.length > 0) {
      items.push({
        type: 'accordion',
        comps: group.lowPickrate,
        tier: group.tier,
      })
    }
  }

  return items
}

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

  // 将分组数据扁平化为虚拟列表项
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
        { value: 'matches', label: '场次' },
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
