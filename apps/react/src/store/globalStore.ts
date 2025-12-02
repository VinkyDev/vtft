import type { AugmentClass, Item, ItemName, Lookups, LookupsUnit, Queue, Trait, UnitValue } from 'types'
import { getComps, getLookups, getSeasons, getUnitItems } from 'api-client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  /** 阵容数据更新时间 */
  compsUpdatedAt: Date | null
  /** 初始化全局状态 */
  initGlobalStore: () => Promise<void>
  /** 强制刷新数据（清除缓存后重新加载） */
  refreshData: () => Promise<void>
  setSeason: (season: string) => Promise<void>
  unitItemsByName: Record<string, ItemName>
  loadUnitItems: () => Promise<void>
  unitItemsIndex: {
    itemNamesById: Record<string, ItemName>
    unitsById: Record<string, UnitValue>
  }
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
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
      compsUpdatedAt: null,
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
        // 如果持久化的赛季不在列表中，降级到第一个赛季
        const persistedSeason = get().curSeason
        const isValidSeason = persistedSeason && seasons.some(s => s.season === persistedSeason)
        const season = isValidSeason ? persistedSeason : seasons[0]?.season
        set({ curSeason: season })
        if (!season)
          return
        const queue = seasons.find(s => s.season === season)?.queue
        const [{ data: lookups = null }, { data: comps = [] }] = await Promise.all([
          getLookups({ season, queue }),
          getComps({ season }),
        ])
        const itemsById = Object.fromEntries((lookups?.items ?? []).filter(i => i.apiName).map(i => [String(i.apiName), i]))
        const unitsById = Object.fromEntries((lookups?.units ?? []).filter(u => u.apiName).map(u => [String(u.apiName), u]))
        const traitsById = Object.fromEntries((lookups?.traits ?? []).filter(t => t.apiName).map(t => [String(t.apiName), t]))
        const augmentsById = Object.fromEntries((lookups?.augments ?? []).filter(a => a.apiName).map(a => [String(a.apiName), a]))
        const compsUpdatedAt = comps[0]?.updatedAt ?? null
        set({ lookups, lookupsIndex: { itemsById, unitsById, traitsById, augmentsById }, compsUpdatedAt, loading: false })
      },
      refreshData: async () => {
        set({ unitItemsByName: {}, unitItemsIndex: { itemNamesById: {}, unitsById: {} }, compsUpdatedAt: null })
        await get().initGlobalStore()
      },
      setSeason: async (season: string) => {
        if (get().curSeason === season)
          return
        set({ curSeason: season, loading: true })
        const queue = get().seasons.find(s => s.season === season)?.queue
        const [{ data: lookups = null }, { data: comps = [] }] = await Promise.all([
          getLookups({ season, queue }),
          getComps({ season }),
        ])
        const itemsById = Object.fromEntries((lookups?.items ?? []).filter(i => i.apiName).map(i => [String(i.apiName), i]))
        const unitsById = Object.fromEntries((lookups?.units ?? []).filter(u => u.apiName).map(u => [String(u.apiName), u]))
        const traitsById = Object.fromEntries((lookups?.traits ?? []).filter(t => t.apiName).map(t => [String(t.apiName), t]))
        const augmentsById = Object.fromEntries((lookups?.augments ?? []).filter(a => a.apiName).map(a => [String(a.apiName), a]))
        const compsUpdatedAt = comps[0]?.updatedAt ?? null
        set({ lookups, lookupsIndex: { itemsById, unitsById, traitsById, augmentsById }, compsUpdatedAt, loading: false })
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
    }),
    {
      name: 'vtft-global-storage',
      partialize: state => ({ curSeason: state.curSeason }),
    },
  ),
)
