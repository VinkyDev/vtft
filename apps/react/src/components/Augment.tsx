import type { AugmentMeta } from 'types'
import { memo, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { useGameDataStore } from '@/store'

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

/** 根据级别获取颜色 */
function getLevelColor(level: string) {
  switch (level) {
    case 'Silver': return { border: 'border-gray-400', bg: 'bg-gray-400', glow: 'shadow-gray-400/50' }
    case 'Gold': return { border: 'border-yellow-400', bg: 'bg-yellow-400', glow: 'shadow-yellow-400/50' }
    case 'Prismatic': return { border: 'border-purple-400', bg: 'bg-purple-400', glow: 'shadow-purple-400/50' }
    default: return { border: 'border-gray-400', bg: 'bg-gray-400', glow: 'shadow-gray-400/50' }
  }
}

/** 根据尺寸获取样式 */
function getSizeClasses(size: 'tiny' | 'small' | 'medium' | 'large') {
  switch (size) {
    case 'tiny':
      return {
        container: 'h-4 w-4',
        tier: 'px-0.5 text-[5px] rounded-[1px]',
      }
    case 'small':
      return {
        container: 'h-6 w-6',
        tier: 'px-0.5 text-[6px] rounded-[1px]',
      }
    case 'medium':
      return {
        container: 'h-8 w-8',
        tier: 'px-0.5 text-[7px] rounded-[2px]',
      }
    case 'large':
      return {
        container: 'h-10 w-10',
        tier: 'px-0.5 text-[8px] rounded-[2px]',
      }
  }
}

export const Augment = memo(({
  augmentName,
  size = 'medium',
  showTooltip = true,
  className = '',
  onClick,
}: AugmentProps) => {
  // 从 store 获取符文数据
  const { augments } = useGameDataStore()

  // 根据 name 查找符文数据
  const augment = useMemo(() => {
    return augments.find(aug => aug.name === augmentName)
  }, [augments, augmentName])

  // 如果没有找到符文数据，返回占位符
  if (!augment) {
    const sizeClasses = getSizeClasses(size)
    return (
      <div className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 border-gray-500 bg-black/40 ${className}`}>
        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[6px] text-white/50">?</span>
        </div>
      </div>
    )
  }

  const levelColors = getLevelColor(augment.level)
  const sizeClasses = getSizeClasses(size)

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
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
          )}
    </div>
  )

  // 如果不显示工具提示，直接返回元素
  if (!showTooltip) {
    return augmentElement
  }

  // 包装工具提示
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {augmentElement}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-black/90 text-white border-white/10"
      >
        <div className="space-y-1">
          <div className="font-semibold">
            {augment.tier}
            {' '}
            ·
            {' '}
            {augment.name}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
})

Augment.displayName = 'Augment'
