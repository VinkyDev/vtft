export enum Queue {
  PBE = 'PBE',
  FORMAL = '1100',
}

export type TFTSetString = `TFTSet${number}_latest_zh_cn`

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
