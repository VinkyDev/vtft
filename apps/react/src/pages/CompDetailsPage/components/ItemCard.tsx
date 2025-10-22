import type { RecommendedItem } from 'types'
import { memo } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, Impact } from '@/components'
import { useAdaptiveList, useItemByName } from '@/hooks'

interface ItemCardProps {
  item: RecommendedItem
}

/**
 * 装备卡片组件
 * 展示单个装备的详细信息（横向一行布局）
 */
export const ItemCard = memo(({ item }: ItemCardProps) => {
  // 获取完整的装备信息（包含合成组件）
  const fullItemData = useItemByName(item.name)

  // 获取合成组件的装备信息
  const component1 = useItemByName(fullItemData?.components?.[0])
  const component2 = useItemByName(fullItemData?.components?.[1])

  const champions = item.recommendedFor || []

  // 自适应适配
  const { containerRef, visibleItems, remainingCount, showMore } = useAdaptiveList<string>({
    items: champions,
    itemWidth: 16,
    moreButtonWidth: 16,
    minVisible: 1,
  })

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-md p-1.5 border border-white/10 hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
      <div className="grid grid-cols-[25px_minmax(60px,10%)_minmax(60px,10%)_1fr] sm:grid-cols-[minmax(160px,25%)_minmax(80px,25%)_minmax(70px,25%)_1fr] gap-2 items-center">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={item.icon}
            alt={item.name}
            className="w-6 h-6 rounded border border-white/20 shrink-0"
            loading="lazy"
          />
          <h3 className="hidden sm:block text-white font-medium text-xs line-clamp-1 min-w-0 flex-1">
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 justify-center">
          {component1 && (
            <img
              src={component1.icon}
              alt={component1.name}
              title={component1.name}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-white/20"
              loading="lazy"
            />
          )}
          {component1 && component2 && (
            <span className="text-gray-500 text-xs">+</span>
          )}
          {component2 && (
            <img
              src={component2.icon}
              alt={component2.name}
              title={component2.name}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-white/20"
              loading="lazy"
            />
          )}
        </div>

        <div className="flex items-center gap-1 justify-center">
          {item.avgRank !== undefined && (
            <>
              <span className="text-gray-400 text-[10px] sm:text-xs">影响</span>
              <Impact avgRank={item.avgRank} className="text-[10px] sm:text-xs" />
            </>
          )}
        </div>

        <div ref={containerRef} className="flex items-center gap-1 min-w-0 justify-end">
          {visibleItems.map(champion => (
            <Champion
              key={champion}
              championName={champion}
              size="tiny"
              showPriority={false}
              showTooltip={true}
              className="!w-4 !h-4 sm:!w-5 sm:!h-5"
            />
          ))}
          {showMore && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-4 h-4 rounded border border-white/20 bg-gray-700/50 flex items-center justify-center text-white text-[7px] font-bold cursor-pointer shrink-0">
                  +
                  {remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-black/90 text-white border-white/10"
              >
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {champions.slice(visibleItems.length).map(champion => (
                    <Champion
                      key={champion}
                      championName={champion}
                      className="!w-4 !h-4"
                      showPriority={false}
                      showTooltip={false}
                    />
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
})

ItemCard.displayName = 'ItemCard'
