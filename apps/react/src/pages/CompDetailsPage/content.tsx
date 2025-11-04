import type { EnhancedCompData } from '@/utils/compRating'
import { useMemo, useState } from 'react'
import { useRequest, withErrorBoundary } from 'react-helper'
import { getCompDetails } from '@/api-client'
import {
  AppTabs,
  AugmentsGridSkeleton,
  ChampionEnhancementsGridSkeleton,
  EmptyState,
  ErrorState,
  FormationBoardSkeleton,
  ItemsGridSkeleton,
} from '@/components'
import { useConfigStore } from '@/store/dataStore'
import { AugmentsGrid, ChampionEnhancementsGrid, FormationBoard, ItemsGrid } from './components'

export interface CompDetailContentProps {
  comp: EnhancedCompData | null
}

function CompDetailContent({ comp }: CompDetailContentProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { windowMode } = useConfigStore()

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

  const skeletonTabs = useMemo(() => [
    {
      value: 'overview',
      label: '概览',
      content: <FormationBoardSkeleton />,
    },
    {
      value: 'items',
      label: '装备',
      content: <ItemsGridSkeleton />,
    },
    {
      value: 'augments',
      label: '强化',
      content: <AugmentsGridSkeleton />,
    },
    {
      value: 'championEnhancements',
      label: '果实',
      content: <ChampionEnhancementsGridSkeleton />,
    },
  ], [])

  const tabs = useMemo(() => {
    if (!compDetails?.data)
      return []

    return [
      {
        value: 'overview',
        label: '概览',
        content: compDetails.data.formation
          ? (
              <FormationBoard formation={compDetails.data.formation} />
            )
          : (
              <EmptyState message="暂无阵容信息" />
            ),
      },
      {
        value: 'items',
        label: '装备',
        content: compDetails.data.items && compDetails.data.items.length > 0
          ? (
              <ItemsGrid items={compDetails.data.items} />
            )
          : (
              <EmptyState message="暂无装备信息" />
            ),
      },
      {
        value: 'augments',
        label: '强化',
        content: compDetails.data.augments && compDetails.data.augments.length > 0
          ? (
              <AugmentsGrid augments={compDetails.data.augments} />
            )
          : (
              <EmptyState message="暂无强化信息" />
            ),
      },
      {
        value: 'championEnhancements',
        label: '果实',
        content: compDetails.data.championEnhancements && compDetails.data.championEnhancements.length > 0
          ? (
              <ChampionEnhancementsGrid championEnhancements={compDetails.data.championEnhancements} />
            )
          : (
              <EmptyState message="暂无果实信息" />
            ),
      },
    ]
  }, [compDetails])

  return (
    <div className={`flex-1 overflow-hidden ${windowMode === 'floating' ? 'pointer-events-none' : ''}`}>
      {loading && comp && (
        <div className="flex flex-col h-full p-2">
          <AppTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={skeletonTabs}
            enableAnimation={true}
          />
        </div>
      )}

      {!loading && comp && tabs.length > 0 && (
        <div className="flex flex-col h-full p-2">
          <AppTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={tabs}
            enableAnimation={true}
          />
        </div>
      )}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default withErrorBoundary(CompDetailContent, {
  errorBoundaryName: 'comp_details_content',
  FallbackComponent: ({ resetErrorBoundary }) => {
    return (
      <ErrorState
        message="加载阵容详情失败"
        onReload={() => {
          resetErrorBoundary()
        }}
      />
    )
  },
})
