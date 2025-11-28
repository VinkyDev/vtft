import type { Trait as TraitMeta } from 'types'
import { memo, useMemo } from 'react'
import { useGlobalStore } from '@/store/globalStore'
import { getTraitStyleColor } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'

interface TraitProps {
  id: string
  /** 显示变体：icon-only 只显示图标(默认), with-label 显示图标+名称+等级 */
  variant?: 'icon-only' | 'with-label'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (trait: TraitMeta) => void
}

const genIcon = (apiName: string) => `https://cdn.metatft.com/file/metatft/traits/${apiName.toLowerCase().trim()}.png`

type Parse<T extends string>
  = T extends `${infer ApiName}_${infer N extends number}`
    ? { apiName: ApiName, traitName: string, level: N }
    : { apiName: T, traitName: string, level?: number }

function parse<T extends string>(str: T): Parse<T> {
  const parts = str.split('_')
  const last = parts[parts.length - 1]
  const hasCount = /^\d+$/.test(last!)
  const apiName = hasCount ? parts.slice(0, -1).join('_') : str
  const apiParts = apiName.split('_')
  const traitName = apiParts[apiParts.length - 1]
  const level = hasCount ? Number(last) : undefined
  return { apiName, traitName, level } as Parse<T>
}

export const Trait = memo(({
  id,
  variant = 'icon-only',
  showTooltip = true,
  className = '',
  onClick,
}: TraitProps) => {
  const { lookupsIndex } = useGlobalStore()
  const { apiName, traitName, level } = useMemo(() => parse(id), [id])
  const trait = useMemo(() => lookupsIndex.traitsById[apiName], [apiName, lookupsIndex])
  const styleColor = useMemo(() => {
    if (!trait)
      return { border: 'border-white/10', bg: 'bg-black/30', glow: 'shadow-white/30' }
    if (level == null)
      return { border: 'border-white/10', bg: 'bg-black/30', glow: 'shadow-white/30' }
    const idx = Math.max(0, Math.min((trait.effects?.length ?? 0) - 1, level - 1))
    const style = trait.effects?.[idx]?.style
    return getTraitStyleColor(style)
  }, [trait, level])
  const minUnits = useMemo(() => {
    if (!trait || level == null)
      return undefined
    const idx = Math.max(0, Math.min((trait.effects?.length ?? 0) - 1, level - 1))
    return trait.effects?.[idx]?.minUnits ?? undefined
  }, [trait, level])

  if (!trait) {
    return <>{id}</>
  }

  // 图标元素
  const iconElement = (
    <>
      <img
        src={genIcon(traitName)}
        alt={trait.name}
        draggable={false}
        className="h-full w-full object-contain"
      />
      {minUnits != null && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm text-[8px] font-bold text-white shadow-lg">
          {minUnits}
        </div>
      )}
    </>
  )

  // icon-only 变体: 小屏幕显示图标+tooltip, 正常屏幕显示图标+名字
  if (variant === 'icon-only') {
    const traitElement = (
      <div
        className={`relative h-5 w-5 overflow-hidden rounded border ${styleColor.border} bg-black/30 p-0.5 transition-all hover:shadow-lg ${styleColor.glow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
        {iconElement}
      </div>
    )

    return (
      <WithTooltip
        show={showTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
            </span>
          </div>
        )}
      >
        {traitElement}
      </WithTooltip>
    )
  }

  return (
    <>
      <WithTooltip
        show={showTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
            </span>
          </div>
        )}
      >
        <div
          className={`sm:hidden relative h-5 w-5 overflow-hidden rounded border ${styleColor.border} bg-black/30 p-0.5 transition-all hover:shadow-lg ${styleColor.glow} ${onClick ? 'cursor-pointer' : ''} ${className}`}
          onClick={() => onClick?.(trait)}
        >
          {iconElement}
        </div>
      </WithTooltip>

      <div
        className={`hidden sm:flex items-center gap-1.5 rounded border ${styleColor.border} bg-black/30 px-2 py-1 transition-all hover:shadow-lg ${styleColor.glow} shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
        <div className="relative h-5 w-5 overflow-hidden rounded shrink-0">
          {iconElement}
        </div>
        <span className="text-xs font-medium text-white/90 whitespace-nowrap">{trait.name}</span>
        {minUnits != null && (
          <span className="text-xs font-bold text-white whitespace-nowrap">
            {minUnits}
          </span>
        )}
      </div>
    </>
  )
})

Trait.displayName = 'Trait'
