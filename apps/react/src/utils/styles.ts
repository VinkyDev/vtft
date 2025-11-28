/** 尺寸类型 */
type Size = 'tiny' | 'small' | 'medium' | 'large' | 'xl'

/** 获取符文等级颜色 */
export function getAugmentLevelColor(level: string) {
  switch (level) {
    case 'Silver': return { border: 'border-gray-400', bg: 'bg-gray-400', glow: 'shadow-gray-400/50' }
    case 'Gold': return { border: 'border-yellow-400', bg: 'bg-yellow-400', glow: 'shadow-yellow-400/50' }
    case 'Prismatic': return { border: 'border-purple-400', bg: 'bg-purple-400', glow: 'shadow-purple-400/50' }
    default: return { border: 'border-gray-400', bg: 'bg-gray-400', glow: 'shadow-gray-400/50' }
  }
}

/** 获取英雄费用颜色 */
export function getChampionCostColor(cost: number) {
  switch (cost) {
    case 1: return { border: 'border-gray-500', bg: 'bg-gray-500' }
    case 2: return { border: 'border-green-500', bg: 'bg-green-500' }
    case 3: return { border: 'border-blue-500', bg: 'bg-blue-500' }
    case 4: return { border: 'border-purple-500', bg: 'bg-purple-500' }
    case 5: return { border: 'border-yellow-500', bg: 'bg-yellow-500' }
    default: return { border: 'border-gray-500', bg: 'bg-gray-500' }
  }
}

/** 获取符文尺寸样式 */
export function getAugmentSizeClasses(size: Exclude<Size, 'xl'>) {
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

/** 获取羁绊效果 style 颜色 */
export function getTraitStyleColor(style?: number) {
  switch (style) {
    case 1: return { border: 'border-amber-600', bg: 'bg-amber-600', glow: 'shadow-amber-600/50' } // 青铜
    case 3: return { border: 'border-gray-400', bg: 'bg-gray-400', glow: 'shadow-gray-400/50' } // 白银
    case 4: return { border: 'border-blue-400', bg: 'bg-blue-400', glow: 'shadow-blue-400/50' } // 独特
    case 5: return { border: 'border-yellow-400', bg: 'bg-yellow-400', glow: 'shadow-yellow-400/50' } // 黄金
    case 6: return { border: 'border-purple-400', bg: 'bg-purple-400', glow: 'shadow-purple-400/50' } // 棱彩
    default: return { border: 'border-white/10', bg: 'bg-black/30', glow: 'shadow-white/30' }
  }
}
