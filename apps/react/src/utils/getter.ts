export function getLevelFromIcon(icon?: string): 'Silver' | 'Gold' | 'Prismatic' {
  if (!icon)
    return 'Silver'

  const romanMatch = icon.match(/_(III|II|I)(?:\.|$)/i)
    ?? icon.match(/(III|II|I)(?:\.|$)/i) // 兜底更宽松的匹配
  const roman = romanMatch?.[1]?.toUpperCase()

  switch (roman) {
    case 'III': return 'Prismatic'
    case 'II': return 'Gold'
    case 'I': return 'Silver'
  }

  const digitMatch = icon.match(/_([321])(?:\.|$)/)
    ?? icon.match(/([321])(?:\.|$)/)
  const digit = digitMatch?.[1]

  switch (digit) {
    case '3': return 'Prismatic'
    case '2': return 'Gold'
    case '1': return 'Silver'
  }

  return 'Silver'
}
