import type { FinalCompTabProps, HeroesTabProps, ItemsTabProps, OverviewTabProps, TransitionTabProps } from './components'
import type { EnhancedCompData } from '@/utils/compRating'
import { getCompDetails } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import {
  AppTabs,
  EmptyState,
  FormationBoardSkeleton,
  ItemsGridSkeleton,
} from '@/components'
import { useConfigStore } from '@/store/configStore'
import { FinalCompTab, HeroesTab, ItemsTab, LazyTabContent, OverviewTab, TransitionTab } from './components'

interface CompDetailContentProps {
  comp: EnhancedCompData | null
}

function getSkeletonTabs(traitsCount?: number) {
  return [
    { value: 'overview', label: '概览', content: <FormationBoardSkeleton traitsCount={traitsCount} /> },
    { value: 'heroes', label: '英雄', content: <ItemsGridSkeleton /> },
    { value: 'items', label: '装备', content: <ItemsGridSkeleton /> },
    { value: 'transition', label: '过渡', content: <ItemsGridSkeleton /> },
    { value: 'final', label: '变阵', content: <ItemsGridSkeleton /> },
  ]
}

export function CompDetailContent({ comp }: CompDetailContentProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { windowMode } = useConfigStore()
  const [activatedTabs, setActivatedTabs] = useState<Set<string>>(() => new Set(['overview']))

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setActivatedTabs((prev) => {
      if (prev.has(tab))
        return prev
      const next = new Set(prev)
      next.add(tab)
      return next
    })
  }

  const { data: compDetails, loading } = useRequest(
    async () => {
      if (!comp?.compId)
        return null
      return await getCompDetails(comp.compId)
    },
    {
      cacheKey: comp?.compId,
      staleTime: 1000 * 60 * 5,
      ready: !!comp?.compId,
    },
  )

  const tabs = useMemo(() => {
    if (!compDetails?.data)
      return []

    const data = compDetails.data

    return [
      {
        value: 'overview',
        label: '概览',
        content: data
          ? (
              <LazyTabContent<OverviewTabProps>
                shouldRender={activatedTabs.has('overview')}
                component={OverviewTab}
                props={{ data, builds: comp?.builds, traits: comp?.traits }}
                fallback={<FormationBoardSkeleton traitsCount={comp?.traits?.length} />}
              />
            )
          : <EmptyState message="暂无阵容信息" />,
      },
      {
        value: 'heroes',
        label: '英雄',
        content: data.item && data.item.length > 0
          ? (
              <LazyTabContent<HeroesTabProps>
                shouldRender={activatedTabs.has('heroes')}
                component={HeroesTab}
                props={{ items: data.item }}
                fallback={<ItemsGridSkeleton />}
              />
            )
          : <EmptyState message="暂无英雄装备数据" />,
      },
      {
        value: 'items',
        label: '装备',
        content: data.item && data.item.length > 0
          ? (
              <LazyTabContent<ItemsTabProps>
                shouldRender={activatedTabs.has('items')}
                component={ItemsTab}
                props={{ items: data.item }}
                fallback={<ItemsGridSkeleton />}
              />
            )
          : <EmptyState message="暂无装备信息" />,
      },
      {
        value: 'transition',
        label: '过渡',
        content: (
          <LazyTabContent<TransitionTabProps>
            shouldRender={activatedTabs.has('transition')}
            component={TransitionTab}
            props={{ earlyOptions: data.early_options, options: data.options }}
            fallback={<ItemsGridSkeleton />}
          />
        ),
      },
      {
        value: 'final',
        label: '变阵',
        content: (
          <LazyTabContent<FinalCompTabProps>
            shouldRender={activatedTabs.has('final')}
            component={FinalCompTab}
            props={{ options: data.options }}
            fallback={<ItemsGridSkeleton />}
          />
        ),
      },
    ]
  }, [compDetails, comp, activatedTabs])

  const skeletonTabs = useMemo(() => getSkeletonTabs(comp?.traits?.length), [comp?.traits?.length])

  return (
    <div className={`flex-1 overflow-hidden ${windowMode === 'floating' ? 'pointer-events-none' : ''}`}>
      {loading && comp && (
        <div className="flex flex-col h-full p-2">
          <AppTabs value={activeTab} onValueChange={handleTabChange} tabs={skeletonTabs} enableAnimation />
        </div>
      )}

      {!loading && comp && tabs.length > 0 && (
        <div className="flex flex-col h-full p-2">
          <AppTabs value={activeTab} onValueChange={handleTabChange} tabs={tabs} enableAnimation />
        </div>
      )}
    </div>
  )
}
