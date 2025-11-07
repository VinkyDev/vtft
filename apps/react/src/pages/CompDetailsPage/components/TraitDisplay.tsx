import type { Trait } from 'types'
import { memo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'

interface TraitDisplayProps {
  trait: Trait
  traitsCount: number
}

/**
 * 羁绊显示组件
 * 小屏幕: 显示图标+等级,hover显示tooltip (保持 TraitIcon 样式)
 * 正常屏幕: 显示图标+等级+名字
 */
export const TraitDisplay = memo(({ trait }: TraitDisplayProps) => {
  return (
    <>
      {/* 小屏幕版本 - 带 tooltip (保持 TraitIcon 样式) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="sm:hidden relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:border-white/30 hover:shadow-lg">
            {trait.icon
              ? (
                  <img
                    src={trait.icon}
                    alt={trait.name}
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                )
              : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
                )}

            {/* 羁绊等级小标 */}
            <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm text-[8px] font-bold text-white shadow-lg">
              {trait.count}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-black/90 text-white border-white/10"
        >
          {trait.name}
          {' '}
          (
          {trait.count}
          )
        </TooltipContent>
      </Tooltip>

      {/* 正常屏幕版本 - 直接显示名字 */}
      <div className="hidden sm:flex items-center gap-1.5 rounded border border-white/10 bg-black/30 px-2 py-1 transition-all hover:border-white/30 hover:shadow-lg flex-shrink-0">
        <div className="relative h-5 w-5 overflow-hidden rounded flex-shrink-0">
          {trait.icon
            ? (
                <img
                  src={trait.icon}
                  alt={trait.name}
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              )
            : (
                <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
              )}
        </div>
        <span className="text-xs font-medium text-white/90 whitespace-nowrap">{trait.name}</span>
        <span className="text-xs font-bold text-white whitespace-nowrap">
          (
          {trait.count}
          )
        </span>
      </div>
    </>
  )
})

TraitDisplay.displayName = 'TraitDisplay'
