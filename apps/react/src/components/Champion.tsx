import type { ChampionMeta } from 'types'
import { memo, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { useGameDataStore } from '@/store'

interface ChampionProps {
  /** 英雄名称 */
  championName: string
  /** 尺寸大小 */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** 是否显示优先级标识 */
  showPriority?: boolean
  /** 自定义优先级文本（如果不提供，使用 rank） */
  priority?: string
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (champion: ChampionMeta) => void
}

/** 根据费用获取颜色 */
function getCostColor(cost: number) {
  switch (cost) {
    case 1: return { border: 'border-gray-500', bg: 'bg-gray-500' }
    case 2: return { border: 'border-green-500', bg: 'bg-green-500' }
    case 3: return { border: 'border-blue-500', bg: 'bg-blue-500' }
    case 4: return { border: 'border-purple-500', bg: 'bg-purple-500' }
    case 5: return { border: 'border-yellow-500', bg: 'bg-yellow-500' }
    default: return { border: 'border-gray-500', bg: 'bg-gray-500' }
  }
}

/** 根据尺寸获取样式 */
function getSizeClasses(size: 'tiny' | 'small' | 'medium' | 'large') {
  switch (size) {
    case 'tiny':
      return {
        container: 'h-4 w-6',
        priority: 'px-0.5 text-[5px] rounded-[1px_1px_1px_1px]',
      }
    case 'small':
      return {
        container: 'h-6 w-8',
        priority: 'px-0.5 text-[6px] rounded-[1px_1px_2px_1px]',
      }
    case 'medium':
      return {
        container: 'h-7 w-9',
        priority: 'px-0.5 text-[7px] rounded-[2px_2px_4px_2px]',
      }
    case 'large':
      return {
        container: 'h-8 w-10',
        priority: 'px-0.5 text-[8px] rounded-[2px_2px_4px_2px]',
      }
  }
}

export const Champion = memo(({
  championName,
  size = 'medium',
  showPriority = true,
  priority,
  showTooltip = true,
  className = '',
  onClick,
}: ChampionProps) => {
  // 从 store 获取英雄数据（必须在组件顶部调用）
  const { champions } = useGameDataStore()

  // 根据 name 查找英雄数据
  const champion = useMemo(() => {
    return champions.find(champ => champ.name === championName)
  }, [champions, championName])

  // 如果没有找到英雄数据，返回 null 或占位符
  if (!champion) {
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

  const costColors = getCostColor(champion.cost || 1)
  const sizeClasses = getSizeClasses(size)

  const championElement = (
    <div
      className={`relative ${sizeClasses.container} overflow-hidden rounded border-2 ${costColors.border} bg-black/40 transition-all hover:scale-110 hover:shadow-lg cursor-pointer ${className}`}
      onClick={() => onClick?.(champion)}
    >
      {champion.icon
        ? (
            <img
              src={champion.icon}
              alt={champion.name}
              className="h-full w-full object-cover"
            />
          )
        : (
            <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
          )}

      {/* 优先级标识 */}
      {showPriority && priority && (
        <div className={`absolute left-0 top-0 ${costColors.bg} ${sizeClasses.priority} font-bold leading-none text-white`}>
          {priority}
        </div>
      )}
    </div>
  )

  // 如果不显示工具提示，直接返回元素
  if (!showTooltip) {
    return championElement
  }

  // 包装工具提示
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {championElement}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-black/90 text-white border-white/10"
      >
        <div className="space-y-1">
          <span className="font-semibold">{champion.name}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
})

Champion.displayName = 'Champion'
