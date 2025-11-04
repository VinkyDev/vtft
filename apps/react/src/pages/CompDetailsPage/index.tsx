import type { EnhancedCompData } from '@/utils/compRating'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from 'ui'
import { useConfigStore } from '@/store/dataStore'
import CompDetailContent from './content'

interface CompDetailPageProps {
  comp: EnhancedCompData | null
  onClose: () => void
}

export default function CompDetailPage({ comp, onClose }: CompDetailPageProps) {
  const { windowMode } = useConfigStore()

  // 在悬浮球模式下，隐藏遮罩层并禁用点击事件
  const overlayClassName = windowMode === 'floating'
    ? `rounded-2xl !z-10 bg-transparent pointer-events-none`
    : `rounded-2xl z-50`
  // 在悬浮球模式下，隐藏 DrawerContent
  const drawerContentClassName = windowMode === 'floating'
    ? `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl !z-10 opacity-0 pointer-events-none`
    : `min-h-screen min-w-[90vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl z-50`

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

        <CompDetailContent comp={comp} />
      </DrawerContent>
    </Drawer>
  )
}
