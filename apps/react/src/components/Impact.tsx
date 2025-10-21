import { memo } from 'react'

interface ImpactProps {
  /** 平均排名值 */
  avgRank: number
  /** 文字大小类名 */
  className?: string
}

/**
 * 影响值组件
 * 根据平均排名计算影响值（avgRank - 4.5），并用颜色表示影响程度
 * - 影响 < 0（排名好）：绿色系，影响越负颜色越深
 * - 影响 > 0（排名差）：红橙色系，影响越正颜色越深
 * - 颜色深浅通过 HSL 动态连续计算
 *
 * @example
 * ```tsx
 * <Impact avgRank={3.2} className="text-sm" />
 * // 显示: -1.30（绿色）
 *
 * <Impact avgRank={5.8} className="text-xs" />
 * // 显示: +1.30（红色）
 * ```
 */
export const Impact = memo(({ avgRank, className = 'text-xs' }: ImpactProps) => {
  // 计算影响值：avgRank - 4.5
  const impact = avgRank - 4.5

  // 动态计算颜色（HSL 连续渐变）
  const getColor = () => {
    const absImpact = Math.abs(impact)

    if (impact < 0) {
      // 负值（好）- 绿色系
      // 色相: 140 (绿色)
      // 饱和度: 根据值调整，值越大饱和度越高
      // 亮度: 根据绝对值调整，值越大亮度越低（颜色越深）
      // 0.1 -> 亮度 58%, 饱和度 50%
      // 0.5 -> 亮度 50%, 饱和度 60%
      // 1.0 -> 亮度 40%, 饱和度 70%
      // 2.0 -> 亮度 20%, 饱和度 75%
      const lightness = Math.max(20, Math.min(60, 60 - absImpact * 20))
      const saturation = Math.min(75, 50 + absImpact * 20)
      return `hsl(140, ${saturation}%, ${lightness}%)`
    }
    else if (impact > 0) {
      // 正值（差）- 红橙色系
      // 色相: 根据值在橙色(30)到红色(0)之间渐变
      // 饱和度: 根据值调整
      // 亮度: 根据绝对值调整
      // 0.1 -> 色相 28, 亮度 58%, 饱和度 55%
      // 0.5 -> 色相 20, 亮度 50%, 饱和度 65%
      // 1.0 -> 色相 10, 亮度 42%, 饱和度 75%
      // 2.0 -> 色相 0,  亮度 25%, 饱和度 80%
      const hue = Math.max(0, 30 - absImpact * 20)
      const lightness = Math.max(25, Math.min(60, 60 - absImpact * 18))
      const saturation = Math.min(80, 55 + absImpact * 20)
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
    else {
      // 等于 0 - 中性灰色
      return `hsl(0, 0%, 60%)`
    }
  }

  const color = getColor()
  const sign = impact > 0 ? '+' : ''

  return (
    <span className={`${className} font-medium`} style={{ color }}>
      {sign}
      {impact.toFixed(2)}
    </span>
  )
})

Impact.displayName = 'Impact'
