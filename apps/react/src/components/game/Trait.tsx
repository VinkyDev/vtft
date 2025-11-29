import type { Trait as TraitMeta } from 'types'
import { memo, useMemo } from 'react'
import { cn } from 'utils'
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
  const traitName = apiParts[apiParts.length - 1] ?? ''
  const level = hasCount ? Number(last) : undefined
  return { apiName, traitName, level } as Parse<T>
}

interface IconBoxProps {
  className?: string
  isActive: boolean
  styleColor: { bg: string, border?: string, glow?: string }
  traitName: string
  name: string
}

function IconBox({ className, isActive, styleColor, traitName, name }: IconBoxProps) {
  const iconUrl = genIcon(traitName)

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden transition-all bg-zinc-900/80',
        isActive ? styleColor.glow : 'shadow-none',
        className || 'h-6 w-6 rounded',
      )}
    >
      {isActive
        ? (
            <div
              className={cn('h-[70%] w-[70%] transition-all', styleColor.bg)}
              style={{
                maskImage: `url(${iconUrl})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: `url(${iconUrl})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
          )
        : (
            <img
              src={iconUrl}
              alt={name}
              draggable={false}
              className="relative h-[70%] w-[70%] object-contain transition-all opacity-40 grayscale"
            />
          )}
    </div>
  )
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
      return { border: '', bg: 'bg-zinc-600', glow: 'shadow-none' }
    if (level == null)
      return { border: '', bg: 'bg-zinc-600', glow: 'shadow-none' }
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

  const isTrulyActive = styleColor.bg !== 'bg-zinc-600'

  // icon-only 变体: 仅显示图标，hover 显示 tooltip
  if (variant === 'icon-only') {
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
        <div
          className={cn(
            'relative cursor-pointer group transition-all hover:scale-105',
            className,
          )}
          onClick={() => onClick?.(trait)}
        >
          <IconBox
            className="h-5 w-5 sm:h-[22px] sm:w-[22px] rounded"
            isActive={isTrulyActive}
            styleColor={styleColor}
            traitName={traitName || ''}
            name={trait.name || ''}
          />

          {minUnits != null && (
            <div className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-black text-[8px] font-bold text-zinc-400 shadow z-10 scale-90">
              {minUnits}
            </div>
          )}
        </div>
      </WithTooltip>
    )
  }

  // with-label 变体: 移动端 icon-only，桌面端完整显示
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
          className={cn(
            'sm:hidden relative cursor-pointer group transition-all hover:scale-105',
            className,
          )}
          onClick={() => onClick?.(trait)}
        >
          <IconBox
            className="h-5 w-5 rounded"
            isActive={isTrulyActive}
            styleColor={styleColor}
            traitName={traitName || ''}
            name={trait.name || ''}
          />
          {minUnits != null && (
            <div className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-black text-[8px] font-bold text-zinc-400 shadow z-10 scale-90">
              {minUnits}
            </div>
          )}
        </div>
      </WithTooltip>

      <div
        className={cn(
          // 容器：极简深色，无边框或极细边框
          'hidden sm:flex items-center gap-2 rounded bg-zinc-900/50 border border-white/5 pr-2.5 py-0.5 pl-0.5 transition-all hover:bg-zinc-800 cursor-pointer group shrink-0',
          className,
        )}
        onClick={() => onClick?.(trait)}
      >
        <IconBox
          className="h-5 w-5 rounded-[3px]"
          isActive={isTrulyActive}
          styleColor={styleColor}
          traitName={traitName || ''}
          name={trait.name || ''}
        />
        <span className={cn('text-xs font-medium whitespace-nowrap', isTrulyActive ? 'text-zinc-200' : 'text-zinc-500')}>
          {trait.name}
        </span>
        {minUnits != null && (
          <span className="ml-auto text-[10px] font-bold text-zinc-500 bg-black/20 px-1 rounded min-w-[16px] text-center">
            {minUnits}
          </span>
        )}
      </div>
    </>
  )
})

Trait.displayName = 'Trait'
