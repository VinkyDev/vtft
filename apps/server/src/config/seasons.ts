import process from 'node:process'
import { Queue } from 'types'
import './env'

interface SeasonConfig { season: string, queue: string }

function parseSeasonsEnv(envValue?: string): SeasonConfig[] {
  if (!envValue)
    throw new Error('SEASONS environment variable is not set')

  return envValue
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [season, queue] = pair.split(':')
      return { season: season || '', queue: queue || '' }
    })
    .filter(cfg => cfg.season && cfg.queue)
}

export function getSeasons(): SeasonConfig[] {
  return parseSeasonsEnv(process.env.SEASONS)
}

function getQueues(): string[] {
  return getSeasons().map(s => s.queue)
}

export function getQueueEnums(): Queue[] {
  return getQueues().map((q) => {
    if (q === Queue.FORMAL)
      return Queue.FORMAL
    if (q === Queue.PBE)
      return Queue.PBE
    return q as Queue
  })
}

export function getQueueBySeason(season: string): string | null {
  const found = getSeasons().find(s => s.season === season)
  return found ? found.queue : null
}

export function getSeasonNames(): [string, ...string[]] {
  const names = getSeasons().map(s => s.season)
  return names as [string, ...string[]]
}
