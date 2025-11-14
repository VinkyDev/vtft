import { memo } from 'react'

interface ImpactProps {
  /** 平均排名值 */
  avgRank: number
  /** 文字大小类名 */
  className?: string
}

export const Impact = memo(({ avgRank, className = 'text-xs' }: ImpactProps) => {
  const impact = avgRank - 4.5

  const getColor = () => {
    const absImpact = Math.abs(impact)

    if (impact < 0) {
      const lightness = Math.max(20, Math.min(60, 60 - absImpact * 20))
      const saturation = Math.min(75, 50 + absImpact * 20)
      return `hsl(140, ${saturation}%, ${lightness}%)`
    }
    else if (impact > 0) {
      const hue = Math.max(0, 30 - absImpact * 20)
      const lightness = Math.max(25, Math.min(60, 60 - absImpact * 18))
      const saturation = Math.min(80, 55 + absImpact * 20)
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }
    else {
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
