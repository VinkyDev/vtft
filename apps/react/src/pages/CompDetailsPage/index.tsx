import type { EnhancedCompData } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, Spinner } from 'ui'
import { getCompDetails } from '@/api-client'
import { AppTabs } from '@/components'
import { useConfigStore } from '@/store'
import { AugmentsGrid, ChampionEnhancementsGrid, FormationBoard, ItemsGrid } from './components'

interface CompDetailPageProps {
  comp: EnhancedCompData | null
  onClose: () => void
}

/**
 * 阵容详情页面
 * 全屏展示阵容的详细信息
 */
export function CompDetailPage({ comp, onClose }: CompDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { windowMode } = useConfigStore()

  // 在悬浮球模式下，降低 Drawer 的 z-index，确保悬浮球在最上层
  const drawerZIndex = windowMode === 'floating' ? '!z-10' : 'z-50'
  // 在悬浮球模式下，隐藏遮罩层并禁用点击事件
  const overlayClassName = windowMode === 'floating'
    ? `rounded-2xl ${drawerZIndex} bg-transparent pointer-events-none`
    : `rounded-2xl ${drawerZIndex}`
  // 在悬浮球模式下，隐藏 DrawerContent
  const drawerContentClassName = windowMode === 'floating'
    ? `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl ${drawerZIndex} opacity-0 pointer-events-none`
    : `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl ${drawerZIndex}`

  // 获取阵容详情数据
  const { data: compDetails, loading } = useRequest(
    async () => {
      if (!comp?.compId)
        return null
      return await getCompDetails(comp.compId)
    },
    {
      refreshDeps: [comp?.compId],
      ready: !!comp?.compId,
    },
  )

  // Tabs 配置
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">暂无站位信息</p>
              </div>
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">暂无装备推荐</p>
              </div>
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">暂无符文推荐</p>
              </div>
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">暂无果实推荐</p>
              </div>
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
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Spinner />
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
