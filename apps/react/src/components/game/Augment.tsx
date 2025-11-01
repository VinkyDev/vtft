import type { AugmentMeta } from 'types'
import { find } from 'lodash-es'
import { memo, useMemo } from 'react'
import { useGameDataStore } from '@/store'
import { getAugmentLevelColor, getAugmentSizeClasses } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'

interface AugmentProps {
  /** 符文名称 */
  augmentName: string
  /** 尺寸大小 */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (augment: AugmentMeta) => void
}

export const Augment = memo(({
  augmentName,
  size = 'medium',
  showTooltip = true,
  className = '',
  onClick,
}: AugmentProps) => {
  const { augments } = useGameDataStore()

  const augment = useMemo(() => {
    return find(augments, aug => aug.name === augmentName)
  }, [augments, augmentName])

  if (!augment) {
    const sizeClasses = getAugmentSizeClasses(size)
    return (
      <div className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 border-gray-500 bg-black/40 ${className}`}>
        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[6px] text-white/50">?</span>
        </div>
      </div>
    )
  }

  const levelColors = getAugmentLevelColor(augment.level)
  const sizeClasses = getAugmentSizeClasses(size)

  const augmentElement = (
    <div
      className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 ${levelColors.border} bg-black/40 transition-all cursor-pointer ${className}`}
      onClick={() => onClick?.(augment)}
    >
      {augment.icon
        ? (
            <img
              src={augment.icon}
              alt={augment.name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
          )}
    </div>
  )

  return (
    <WithTooltip
      show={showTooltip}
      content={(
        <div className="space-y-1">
          <div className="font-semibold">
            {augment.tier}
            {' '}
            ·
            {' '}
            {augment.name}
          </div>
        </div>
      )}
    >
      {augmentElement}
    </WithTooltip>
  )
})

Augment.displayName = 'Augment'
