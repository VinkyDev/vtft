import type { Trait as TraitMeta } from 'types'
import { memo } from 'react'
import { useConfigStore } from '@/store/configStore'
import { WithTooltip } from '../common/WithTooltip'

interface TraitProps {
  /** 直接传入羁绊数据 */
  trait: TraitMeta
  /** 显示变体：icon-only 只显示图标(默认), with-label 显示图标+名称+等级 */
  variant?: 'icon-only' | 'with-label'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (trait: TraitMeta) => void
}

export const Trait = memo(({
  trait,
  variant = 'icon-only',
  showTooltip = true,
  className = '',
  onClick,
}: TraitProps) => {
  const { tooltipConfig } = useConfigStore()

  // 检查是否应该显示工具提示
  const shouldShowTooltip = showTooltip && tooltipConfig.traitTooltip

  // 图标元素（共用）
  const iconElement = (
    <>
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
            <div className="h-full w-full bg-linear-to-br from-gray-600 to-gray-700" />
          )}

      {/* 羁绊等级小标 */}
      <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm text-[8px] font-bold text-white shadow-lg">
        {trait.count}
      </div>
    </>
  )

  // icon-only 变体: 小屏幕显示图标+tooltip, 正常屏幕显示图标+名字
  if (variant === 'icon-only') {
    const traitElement = (
      <div
        className={`relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:border-white/30 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
        {iconElement}
      </div>
    )

    return (
      <WithTooltip
        show={shouldShowTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
              {' '}
              (
              {trait.count}
              )
            </span>
          </div>
        )}
      >
        {traitElement}
      </WithTooltip>
    )
  }

  // with-label 变体: 小屏幕显示图标+tooltip, 正常屏幕显示图标+名字+等级
  return (
    <>
      {/* 小屏幕版本 - 带 tooltip */}
      <WithTooltip
        show={shouldShowTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
              {' '}
              (
              {trait.count}
              )
            </span>
          </div>
        )}
      >
        <div
          className={`sm:hidden relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:border-white/30 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
          onClick={() => onClick?.(trait)}
        >
          {iconElement}
        </div>
      </WithTooltip>

      {/* 正常屏幕版本 - 直接显示名字 */}
      <div
        className={`hidden sm:flex items-center gap-1.5 rounded border border-white/10 bg-black/30 px-2 py-1 transition-all hover:border-white/30 hover:shadow-lg flex-shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
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
                <div className="h-full w-full bg-linear-to-br from-gray-600 to-gray-700" />
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

Trait.displayName = 'Trait'
