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
    default: return { border: 'border-orange-500', bg: 'bg-orange-500' } // 五费以上
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
    case 1: return { border: '', bg: 'bg-[#907659]', glow: 'shadow-[#907659]/50' } // 青铜
    case 3: return { border: '', bg: 'bg-[#9aa4af]', glow: 'shadow-[#9aa4af]/50' } // 白银
    case 4: return { border: '', bg: 'bg-[#ff8f34]', glow: 'shadow-[#ff8f34]/50' } // 专属 (保持橙色系但更协调)
    case 5: return { border: '', bg: 'bg-[#eb9c00]', glow: 'shadow-[#eb9c00]/50' } // 黄金
    case 6: return { border: '', bg: 'bg-gradient-to-br from-cyan-300 via-purple-300 to-fuchsia-300', glow: 'shadow-cyan-400/50' } // 棱彩 (保持不变，暂未指定)
    default: return { border: '', bg: 'bg-zinc-600', glow: 'shadow-none' }
  }
}
