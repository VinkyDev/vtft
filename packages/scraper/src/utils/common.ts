export function normalizeTop8(places?: number[]): number[] {
  return places?.slice(0, 8) || []
}

export function countFromPlaces(top8: number[], fallback?: number): number {
  if (typeof fallback === 'number' && fallback > 0)
    return fallback
  return top8.reduce((a, b) => a + b, 0)
}

export function calcAvg(top8: number[], count: number): number {
  if (!count)
    return 0
  let total = 0
  for (let i = 0; i < top8.length; i++)
    total += (i + 1) * (top8[i] || 0)
  return total / count
}

export function calcFirstRate(top8: number[], count: number): number {
  return count ? (top8[0] || 0) / count : 0
}

export function calcTop4Rate(top8: number[], count: number): number {
  if (!count)
    return 0
  return top8.slice(0, 4).reduce((a, b) => a + b, 0) / count
}

export function calcPickRate(count: number, totalMatches: number): number {
  return totalMatches ? (count / totalMatches) * 8 : 0
}
