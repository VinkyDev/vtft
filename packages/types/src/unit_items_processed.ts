export interface UnitItemsProcessed {
  units?: { [key: string]: UnitValue }
  itemNames?: { [key: string]: ItemName }
  updated?: number
  overall?: Overall
  tft_set?: string
  queue_id?: number
}

export interface ItemName {
  itemName?: string
  count?: number
  place?: number
  avg?: number
  pick?: number
  units?: UnitElement[]
}

export interface UnitElement {
  unit?: string
}

export interface Overall {
  count?: number
}

export interface UnitValue {
  unit?: string
  count?: number
  place?: number
  avg?: number
  pick?: number
  items?: UnitValueItem[]
}

export interface UnitValueItem {
  itemName?: string
}
