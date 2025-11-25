import type { Queue } from 'types'

export interface fetchDataBasicParams {
  queue: Queue
}

export interface fetchCompsStatsParams extends fetchDataBasicParams {
  days?: number
}

export interface fetchCompsDetailsParams extends fetchDataBasicParams {
  cluster_id: number
  compId: string
}
