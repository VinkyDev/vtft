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

/** 获取英雄尺寸样式 */
export function getChampionSizeClasses(size: Exclude<Size, 'xl'>) {
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

/** 获取装备尺寸样式 */
export function getItemSizeClasses(size: Size) {
  switch (size) {
    case 'tiny':
      return 'h-2 w-2'
    case 'small':
      return 'h-3 w-3'
    case 'medium':
      return 'h-4 w-4'
    case 'large':
      return 'h-6 w-6'
    case 'xl':
      return 'size-12'
  }
}

/** 获取装备变体样式 */
export function getItemVariantClasses(variant: 'default' | 'card' | 'recipe') {
  switch (variant) {
    case 'default':
      return 'rounded border border-gray-600 bg-black/60'
    case 'card':
      return 'rounded-md border border-white/10 bg-black/20'
    case 'recipe':
      return 'rounded border border-gray-500/50 bg-gray-800/30'
  }
}
