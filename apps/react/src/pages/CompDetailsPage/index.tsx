import type { EnhancedCompData } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerOverlay, DrawerTitle, Spinner } from 'ui'
import { getCompDetails } from '@/api'
import { AppTabs } from '@/components'
import { FormationBoard, ItemsGrid } from './components'

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
        label: '符文',
        content: (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">符文信息开发中...</p>
          </div>
        ),
      },
      {
        value: 'traits',
        label: '羁绊',
        content: (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">羁绊信息开发中...</p>
          </div>
        ),
      },
    ]
  }, [compDetails])

  return (
    <Drawer
      open={!!comp}
      direction="right"
      onOpenChange={(open) => {
        if (!open)
          onClose()
      }}
    >
      <DrawerOverlay className="rounded-2xl" />
      <DrawerContent className="min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl">
        <DrawerTitle className="sr-only">阵容详情</DrawerTitle>
        <DrawerDescription className="sr-only">
          查看阵容站位和配置信息
        </DrawerDescription>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
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
