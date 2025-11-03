import type { EnhancedCompData } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from 'ui'
import { getCompDetails } from '@/api-client'
import {
  AppTabs,
  AugmentsGridSkeleton,
  ChampionEnhancementsGridSkeleton,
  EmptyState,
  FormationBoardSkeleton,
  ItemsGridSkeleton,
} from '@/components'
import { useConfigStore } from '@/store/dataStore'
import { AugmentsGrid, ChampionEnhancementsGrid, FormationBoard, ItemsGrid } from './components'

interface CompDetailPageProps {
  comp: EnhancedCompData | null
  onClose: () => void
}

function CompDetailPage({ comp, onClose }: CompDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { windowMode } = useConfigStore()

  // 在悬浮球模式下，隐藏遮罩层并禁用点击事件
  const overlayClassName = windowMode === 'floating'
    ? `rounded-2xl !z-10 bg-transparent pointer-events-none`
    : `rounded-2xl z-50`
  // 在悬浮球模式下，隐藏 DrawerContent
  const drawerContentClassName = windowMode === 'floating'
    ? `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl !z-10 opacity-0 pointer-events-none`
    : `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl z-50`

  // 获取阵容详情数据
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

  // 骨架屏 Tabs 配置
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
      label: '推荐符文',
      content: <AugmentsGridSkeleton />,
    },
    {
      value: 'championEnhancements',
      label: '推荐果实',
      content: <ChampionEnhancementsGridSkeleton />,
    },
  ], [])

  // 实际 Tabs 配置
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
              <EmptyState message="暂无站位信息" />
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
              <EmptyState message="暂无装备推荐" />
            ),
      },
      {
        value: 'augments',
        label: '推荐符文',
        content: compDetails.data.augments && compDetails.data.augments.length > 0
          ? (
              <AugmentsGrid augments={compDetails.data.augments} />
            )
          : (
              <EmptyState message="暂无符文推荐" />
            ),
      },
      {
        value: 'championEnhancements',
        label: '推荐果实',
        content: compDetails.data.championEnhancements && compDetails.data.championEnhancements.length > 0
          ? (
              <ChampionEnhancementsGrid championEnhancements={compDetails.data.championEnhancements} />
            )
          : (
              <EmptyState message="暂无果实推荐" />
            ),
      },
    ]
  }, [compDetails])

  return (
    <Drawer
      open={!!comp}
      direction="right"
      handleOnly={true}
      onOpenChange={(open) => {
        // 在悬浮球模式下，阻止通过点击遮罩关闭 Drawer
        if (!open && windowMode === 'floating') {
          return
        }
        if (!open)
          onClose()
      }}
    >
      <DrawerContent
        className={drawerContentClassName}
        overlayClassName={overlayClassName}
      >
        <DrawerTitle className="sr-only">阵容详情</DrawerTitle>
        <DrawerDescription className="sr-only">
          查看阵容站位和配置信息
        </DrawerDescription>

        {/* 内容区域 */}
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
      </DrawerContent>
    </Drawer>
  )
}

export default CompDetailPage
