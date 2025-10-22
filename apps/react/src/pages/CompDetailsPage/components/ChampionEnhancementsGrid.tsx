import type { ChampionEnhancement, Enhancement } from 'types'
import { memo } from 'react'
import { ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { t } from 'utils'
import { Champion } from '@/components'
import { useIsSmallWindow } from '@/hooks'
import { getTierBgColor } from '@/utils/tier'

interface EnhancementItemProps {
  enhancement: Enhancement
  isSmallWindow: boolean
}

/**
 * 果实项目组件
 * 展示单个果实的信息，小屏幕时tag信息在tooltip中展示，大屏幕时直接显示
 */
const EnhancementItem = memo(({ enhancement, isSmallWindow }: EnhancementItemProps) => {
  // 小屏幕模式 - 紧凑布局，tag在tooltip中
  if (isSmallWindow) {
    const enhancementElement = (
      <div className="flex items-center justify-between p-1.5 rounded bg-black/20 border border-white/5 cursor-pointer hover:bg-black/30 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white truncate">
            {enhancement.name}
          </p>
        </div>

        {enhancement.tier && (
          <div className={`ml-1.5 w-3 h-3 flex items-center justify-center text-[8px] font-bold rounded ${getTierBgColor(enhancement.tier)}`}>
            {enhancement.tier}
          </div>
        )}
      </div>
    )

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {enhancementElement}
        </TooltipTrigger>
        <TooltipContent
          className="bg-black/90 text-white border-white/10"
        >
          <div className="space-y-1">
            <div className="font-semibold text-xs">{enhancement.name}</div>
            <div className="flex flex-wrap gap-1">
              {enhancement?.tags?.map(tag => (
                <div
                  key={tag}
                  className="text-[10px] h-5 px-1 flex items-center justify-center rounded bg-gray-700 text-gray-300"
                >
                  {t(tag, { autoReplace: true })}
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/5">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white truncate">
          {enhancement.name}
        </p>
        {enhancement.tags && enhancement.tags.length > 0 && (
          <div className="flex gap-1 mt-1">
            {enhancement.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1 py-0.5 rounded bg-gray-700 text-gray-300"
              >
                {t(tag, { autoReplace: true })}
              </span>
            ))}
          </div>
        )}
      </div>

      {enhancement.tier && (
        <div className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded ${getTierBgColor(enhancement.tier)}`}>
          {enhancement.tier}
        </div>
      )}
    </div>
  )
})

EnhancementItem.displayName = 'EnhancementItem'

interface ChampionEnhancementCardProps {
  championEnhancement: ChampionEnhancement
  isSmallWindow: boolean
}

/**
 * 英雄果实卡片组件
 * 展示单个英雄及其推荐的果实，根据屏幕尺寸调整布局
 */
const ChampionEnhancementCard = memo(({ championEnhancement, isSmallWindow }: ChampionEnhancementCardProps) => {
  const { championName, enhancements } = championEnhancement

  return (
    <div className={`group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] ${isSmallWindow ? 'p-2' : 'p-3'}`}>
      {/* 英雄头像 */}
      <div className={`flex items-center justify-center ${isSmallWindow ? 'mb-2' : 'mb-3'}`}>
        <Champion
          championName={championName}
          size={isSmallWindow ? 'tiny' : 'small'}
          showTooltip={true}
          showPriority={false}
        />
      </div>

      {/* 果实列表 */}
      <div className={isSmallWindow ? 'space-y-1' : 'space-y-1.5'}>
        {enhancements.map((enhancement, index) => (
          <EnhancementItem
            key={`${enhancement.name}-${index}`}
            enhancement={enhancement}
            isSmallWindow={isSmallWindow}
          />
        ))}
      </div>
    </div>
  )
})

ChampionEnhancementCard.displayName = 'ChampionEnhancementCard'

interface ChampionEnhancementsGridProps {
  championEnhancements: ChampionEnhancement[]
}

/**
 * 英雄果实推荐组件
 * 展示阵容中每个英雄的果实推荐，根据屏幕尺寸调整布局
 */
export const ChampionEnhancementsGrid = memo(({ championEnhancements }: ChampionEnhancementsGridProps) => {
  const isSmallWindow = useIsSmallWindow()

  if (!championEnhancements || championEnhancements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">暂无果实推荐</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-50px)] sm:h-[calc(100vh-60px)]" type="scroll">
        <div className={isSmallWindow ? 'p-3' : 'p-4'}>
          <div className={`grid grid-cols-3 ${isSmallWindow ? 'gap-2' : 'gap-3'}`}>
            {championEnhancements.map((championEnhancement, index) => (
              <ChampionEnhancementCard
                key={`${championEnhancement.championName}-${index}`}
                championEnhancement={championEnhancement}
                isSmallWindow={isSmallWindow}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

ChampionEnhancementsGrid.displayName = 'ChampionEnhancementsGrid'
