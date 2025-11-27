import type { ScheduledTask } from './index'
import { createAugmentsTask } from './tasks/augments'
import { createCompsTask } from './tasks/comps'
import { createItemsTask } from './tasks/items'
import { createLookupsTask } from './tasks/lookups'
import { createUnitItemsTask } from './tasks/unit_items'
import { createUnitsTask } from './tasks/units'

export function createCrawlerTasks(): ScheduledTask[] {
  return [
    createItemsTask(),
    createAugmentsTask(),
    createUnitsTask(),
    createCompsTask(),
    createLookupsTask(),
    createUnitItemsTask(),
  ]
}
