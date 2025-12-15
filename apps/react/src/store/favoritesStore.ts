import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favorites: Set<string>
  toggle: (compId: string) => void
  isFavorite: (compId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: new Set<string>(),
      toggle: (compId: string) => {
        const favorites = new Set(get().favorites)
        if (favorites.has(compId)) {
          favorites.delete(compId)
        }
        else {
          favorites.add(compId)
        }
        set({ favorites })
      },
      isFavorite: (compId: string) => get().favorites.has(compId),
    }),
    {
      name: 'vtft-favorites',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str)
            return null
          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              favorites: new Set(parsed.state.favorites ?? []),
            },
          }
        },
        setItem: (name, value) => {
          const toStore = {
            ...value,
            state: {
              ...value.state,
              favorites: [...value.state.favorites],
            },
          }
          localStorage.setItem(name, JSON.stringify(toStore))
        },
        removeItem: name => localStorage.removeItem(name),
      },
    },
  ),
)
