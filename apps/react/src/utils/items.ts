import type { Item } from 'types'
import { ItemTag } from 'types'

export type ItemCategory = 'core' | 'radiant' | 'artifact' | 'emblem'

export function getItemCategory(id: string, lookupsIndex: Record<string, Item>): ItemCategory | undefined {
  const meta = lookupsIndex[id]
  if (!meta)
    return undefined
  const name = String(meta.name ?? '')
  const tags = meta.tags ?? []
  if (name.includes('光明'))
    return 'radiant'
  if (tags.includes(ItemTag.Artifact) || tags.includes(ItemTag.Support))
    return 'artifact'
  if (name.includes('纹章'))
    return 'emblem'
  if ((meta.composition ?? []).length === 2)
    return 'core'
  return undefined
}
