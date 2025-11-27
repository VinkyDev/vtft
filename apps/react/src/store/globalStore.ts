import type { AugmentClass, Item, ItemName, Lookups, LookupsUnit, Queue, Trait, UnitValue } from 'types'
import { getLookups, getSeasons, getUnitItems } from 'api-client'
import { create } from 'zustand'

interface GlobalState {
  lookups: Lookups | null
  lookupsIndex: {
    itemsById: Record<string, Item>
    unitsById: Record<string, LookupsUnit>
    traitsById: Record<string, Trait>
    augmentsById: Record<string, AugmentClass>
  }
  curSeason: string | undefined
  seasons: { season: string, queue: Queue }[]
  loading: boolean
  /** 初始化全局状态, 包括基础数据和赛季数据 */
  initGlobalStore: () => Promise<void>
  setSeason: (season: string) => Promise<void>
  unitItemsByName: Record<string, ItemName>
  loadUnitItems: () => Promise<void>
  unitItemsIndex: {
    itemNamesById: Record<string, ItemName>
    unitsById: Record<string, UnitValue>
  }
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  curSeason: undefined,
  seasons: [],
  lookups: null,
  lookupsIndex: {
    itemsById: {},
    unitsById: {},
    traitsById: {},
    augmentsById: {},
  },
  loading: true,
  unitItemsByName: {},
  unitItemsIndex: {
    itemNamesById: {},
    unitsById: {},
  },
  initGlobalStore: async () => {
    set({ loading: true })
    // 获取所有赛季
    const { data: seasons = [] } = await getSeasons()
    set({ seasons })
    // 如果当前赛季不存在，设置为第一个赛季
    const season = !seasons.find(s => s.season === get().curSeason) ? seasons[0]?.season : get().curSeason
    set({ curSeason: season })
    if (!season)
      return
    const queue = seasons.find(s => s.season === season)?.queue
    const { data: lookups = null } = await getLookups({ season, queue })
    const itemsById = Object.fromEntries((lookups?.items ?? []).filter(i => i.apiName).map(i => [String(i.apiName), i]))
    const unitsById = Object.fromEntries((lookups?.units ?? []).filter(u => u.apiName).map(u => [String(u.apiName), u]))
    const traitsById = Object.fromEntries((lookups?.traits ?? []).filter(t => t.apiName).map(t => [String(t.apiName), t]))
    const augmentsById = Object.fromEntries((lookups?.augments ?? []).filter(a => a.apiName).map(a => [String(a.apiName), a]))
    set({ lookups, lookupsIndex: { itemsById, unitsById, traitsById, augmentsById }, loading: false })
  },
  setSeason: async (season: string) => {
    if (get().curSeason === season)
      return
    set({ curSeason: season, loading: true })
    const queue = get().seasons.find(s => s.season === season)?.queue
    const { data: lookups = null } = await getLookups({ season, queue })
    const itemsById = Object.fromEntries((lookups?.items ?? []).filter(i => i.apiName).map(i => [String(i.apiName), i]))
    const unitsById = Object.fromEntries((lookups?.units ?? []).filter(u => u.apiName).map(u => [String(u.apiName), u]))
    const traitsById = Object.fromEntries((lookups?.traits ?? []).filter(t => t.apiName).map(t => [String(t.apiName), t]))
    const augmentsById = Object.fromEntries((lookups?.augments ?? []).filter(a => a.apiName).map(a => [String(a.apiName), a]))
    set({ lookups, lookupsIndex: { itemsById, unitsById, traitsById, augmentsById }, loading: false })
  },
  loadUnitItems: async () => {
    if (Object.keys(get().unitItemsByName).length > 0)
      return
    const { data } = await getUnitItems()
    const itemNames = data?.itemNames ?? {}
    const units = data?.units ?? {}
    const itemNamesById: Record<string, ItemName> = Object.fromEntries(
      Object.entries(itemNames).map(([key, value]) => [String(value?.itemName ?? key), value]),
    )
    const unitsById: Record<string, UnitValue> = Object.fromEntries(
      Object.entries(units).map(([key, value]) => [String(value?.unit ?? key), value]),
    )
    set({ unitItemsByName: itemNames, unitItemsIndex: { itemNamesById, unitsById } })
  },
}))
