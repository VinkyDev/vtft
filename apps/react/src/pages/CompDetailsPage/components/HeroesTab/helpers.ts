import type { ChampionItemEntry } from './types'

export const BASE_ITEMS = [
  'TFT_Item_BFSword',
  'TFT_Item_ChainVest',
  'TFT_Item_GiantsBelt',
  'TFT_Item_NeedlesslyLargeRod',
  'TFT_Item_NegatronCloak',
  'TFT_Item_RecurveBow',
  'TFT_Item_SparringGloves',
  'TFT_Item_TearOfTheGoddess',
]

const IMPORTANCE_THRESHOLD = 0.35

export function calcRelativeScores(items: ChampionItemEntry[]): ChampionItemEntry[] {
  if (items.length === 0)
    return []

  const maxImportance = items[0]?.importance ?? 1
  if (maxImportance <= 0)
    return items.map(i => ({ ...i, relativeScore: 0 }))

  return items.map(item => ({
    ...item,
    relativeScore: item.importance / maxImportance,
  }))
}

export function splitByImportance(items: ChampionItemEntry[]): {
  important: ChampionItemEntry[]
  optional: ChampionItemEntry[]
} {
  const withScore = calcRelativeScores(items)
  const important = withScore.filter(i => i.relativeScore >= IMPORTANCE_THRESHOLD)
  const optional = withScore.filter(i => i.relativeScore < IMPORTANCE_THRESHOLD)
  return { important, optional }
}

export function getImportanceColor(value: number): string {
  if (value >= 0.8)
    return 'hsl(140, 70%, 45%)'
  if (value >= 0.5)
    return 'hsl(60, 60%, 50%)'
  if (value >= 0.2)
    return 'hsl(30, 60%, 50%)'
  return 'hsl(0, 0%, 50%)'
}
