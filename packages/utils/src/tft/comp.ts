import type { Comp } from 'types'

export function generateCompId(comp: Comp, queue: string): string {
  const unitCount = comp.units?.length || 0
  return `comp_${unitCount}_${comp.clusterId}_${comp.id}_${queue}`
    .toLowerCase()
    .replace(/\s+/g, '_')
}
