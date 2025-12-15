export interface ChampionItemEntry {
  itemName: string
  count: number
  avg: number
  importance: number
  relativeScore: number
  composition: string[]
}

export interface ChampionData {
  championId: string
  totalImportance: number
  coreImportant: ChampionItemEntry[]
  coreOptional: ChampionItemEntry[]
  artifact: ChampionItemEntry[]
  radiant: ChampionItemEntry[]
}
