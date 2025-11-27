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
import { FormationBoard, ItemsGrid } from './components'

interface CompDetailContentProps {
  comp: EnhancedCompData | null
}

export function CompDetailContent({ comp }: CompDetailContentProps) {
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
  ], [])

  const tabs = useMemo(() => {
    if (!compDetails?.data)
      return []

    return [
      {
        value: 'overview',
        label: '概览',
        content: compDetails.data
          ? (
              <FormationBoard data={compDetails.data} builds={comp?.builds} traits={comp?.traits} />
            )
          : (
              <EmptyState message="暂无阵容信息" />
            ),
      },
      {
        value: 'items',
        label: '装备',
        content: compDetails.data.item && compDetails.data.item.length > 0
          ? (
              <ItemsGrid items={compDetails.data.item} />
            )
          : (
              <EmptyState message="暂无装备信息" />
            ),
      },
    ]
  }, [compDetails, comp])

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
