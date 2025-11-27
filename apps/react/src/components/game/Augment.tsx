import type { ReactNode } from 'react'
import type { AugmentClass } from 'types'
import { memo } from 'react'
import { cn } from 'utils'
import { useGlobalStore } from '@/store/globalStore'
import { getLevelFromIcon } from '@/utils/getter'
import { getAugmentLevelColor, getAugmentSizeClasses } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'

interface AugmentProps {
  /** 符文名称 */
  id: string
  /** 尺寸大小 */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (augment: AugmentClass) => void
  /** 包装类 */
  wrapperClassName?: string
  /** 额外的渲染内容 */
  renderExtra?: (unit: AugmentClass) => ReactNode
}

function getIcon(icon?: string) {
  if (!icon) {
    return ''
  }

  const iconName = icon.match(/([^/]+?)(?:\.TFT_Set\d+)?\.tex$/)?.[1] ?? ''

  return `https://cdn.metatft.com/cdn-cgi/image/width=46,height=46,format=auto/https://cdn.metatft.com/file/metatft/augments/${iconName.toLowerCase()}.png`
}

export const Augment = memo(({
  id,
  size = 'medium',
  showTooltip = true,
  className = '',
  wrapperClassName = '',
  onClick,
  renderExtra,
}: AugmentProps) => {
  const { lookupsIndex } = useGlobalStore()

  const augment = lookupsIndex.augmentsById[id]

  if (!augment) {
    return null
  }

  const levelColors = getAugmentLevelColor(getLevelFromIcon(augment?.icon))
  const sizeClasses = getAugmentSizeClasses(size)

  const augmentElement = (
    <div
      className={`relative ${sizeClasses.container} overflow-hidden rounded border-1 ${levelColors.border} bg-black/40 transition-all cursor-pointer ${className}`}
      onClick={() => onClick?.(augment)}
    >
      <img
        src={getIcon(augment.icon)}
        alt={augment.name}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )

  return (
    <WithTooltip
      show={showTooltip}
      content={(
        <div className="space-y-1">
          <div className="font-semibold">
            {augment.name}
          </div>
        </div>
      )}
    >
      <div className={cn('flex items-center justify-center w-full', wrapperClassName)}>
        {augmentElement}
        {renderExtra?.(augment)}
      </div>
    </WithTooltip>
  )
})

Augment.displayName = 'Augment'
