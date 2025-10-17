import type { Trait } from 'types'
import { memo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'

interface TraitIconProps {
  trait: Trait
}

export const TraitIcon = memo(({ trait }: TraitIconProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:scale-110 hover:border-white/30 hover:shadow-lg">
          {trait.icon
            ? (
                <img
                  src={trait.icon}
                  alt={trait.name}
                  className="h-full w-full object-contain"
                />
              )
            : (
                <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-700" />
              )}

          {/* 羁绊等级小标 */}
          <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm text-[8px] font-bold text-white shadow-lg">
            {trait.level}
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
        {trait.level}
        )
      </TooltipContent>
    </Tooltip>
  )
})

TraitIcon.displayName = 'TraitIcon'
