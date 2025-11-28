import type { Option } from 'types'
import { memo, useMemo } from 'react'
import { ScrollArea } from 'ui'
import { Champion, EmptyState } from '@/components'

interface BuildsProps {
  earlyOptions?: Record<string, Option[]>
  options?: Record<string, Option[]>
}

function parseUnitList(str?: string): string[] {
  if (!str)
    return []
  return str.split('&').map(s => s.trim()).filter(Boolean)
}

function formatAvg(avg?: number): string {
  if (avg === undefined || avg === null)
    return '-'
  return Number.isFinite(avg) ? avg.toFixed(2) : '-'
}

export const Builds = memo(({ earlyOptions, options }: BuildsProps) => {
  const earlyEntries = useMemo(() => Object.entries(earlyOptions || {}), [earlyOptions])
  const lateEntries = useMemo(() => Object.entries(options || {}).sort((a, b) => Number(a[0]) - Number(b[0])), [options])

  const aggregate = (opts: Option[]) => {
    const list = opts || []
    const weights = list.map(o => o.count ?? 1)
    const totalWeight = weights.reduce((a, b) => a + b, 0) || 1
    const unitWeight: Record<string, number> = {}
    list.forEach((o, i) => {
      parseUnitList(o.unit_list).forEach((u) => { unitWeight[u] = (unitWeight[u] ?? 0) + weights[i]! })
    })
    const entries = Object.entries(unitWeight).sort((a, b) => b[1] - a[1])
    const ratios = entries.map(([u, w]) => [u, w / totalWeight] as const)
    const requiredThreshold = 0.6
    const required = ratios.filter(([, r]) => r >= requiredThreshold).map(([u]) => u)
    const optional = ratios.filter(([, r]) => r < requiredThreshold).map(([u]) => u)
    const sumCount = list.reduce((s, o) => s + (o.count ?? 0), 0)
    const sumAvgWeight = list.reduce((s, o) => s + ((o.avg ?? 0) * (o.count ?? 0)), 0)
    const sumWinWeight = list.reduce((s, o) => s + ((o.win ?? 0) * (o.count ?? 0)), 0)
    const weightedAvg = sumCount > 0 ? sumAvgWeight / sumCount : undefined
    const weightedWin = sumCount > 0 ? sumWinWeight / sumCount : undefined
    return { required, optional, count: sumCount, avg: weightedAvg, win: weightedWin }
  }

  const hasContent = useMemo(() => {
    const earlyCount = earlyEntries.reduce((sum, [, list]) => sum + (list?.length || 0), 0)
    const lateCount = lateEntries.reduce((sum, [, list]) => sum + (list?.length || 0), 0)
    return earlyCount > 0 || lateCount > 0
  }, [earlyEntries, lateEntries])

  if (!hasContent) {
    return <EmptyState message="暂无阵容配置" />
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-100px)] sm:h-[calc(100vh-110px)]">
        <div className="flex flex-col gap-3 p-2">
          {earlyEntries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-sm font-semibold">早期阵容</h3>
              </div>
              {earlyEntries.map(([key, opts]) => (
                <div key={key} className="space-y-1">
                  <div className="text-xs text-gray-300">{key}</div>
                  <div className="flex flex-col gap-1">
                    {opts.slice(0, 3).map((opt, idx) => {
                      const units = parseUnitList(opt.unit_list)
                      return (
                        <div key={`${key}-${idx}`} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            {units.map(u => (
                              <Champion key={u} id={u} className="sm:size-7.5 size-6" showTooltip />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-300">
                            <span>
                              场次
                              {opt.count ?? 0}
                            </span>
                            <span>
                              平均
                              {formatAvg(opt.avg)}
                            </span>
                            {opt.win !== undefined && (
                              <span>
                                胜率
                                {(opt.win * 100).toFixed(1)}
                                %
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {lateEntries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-sm font-semibold">后期阵容</h3>
              </div>
              {lateEntries.map(([lvl, opts]) => {
                const agg = aggregate(opts)
                const levelSize = Number.isFinite(Number(lvl)) ? Number(lvl) : 8
                const optionalShown = agg.optional.slice(0, Math.max(0, Math.min(6, levelSize - agg.required.length + 2)))
                return (
                  <div key={lvl} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-300">
                        等级
                        {lvl}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-300">
                        <span>
                          场次
                          {agg.count ?? 0}
                        </span>
                        <span>
                          平均
                          {formatAvg(agg.avg)}
                        </span>
                        {agg.win !== undefined && (
                          <span>
                            胜率
                            {((agg.win ?? 0) * 100).toFixed(1)}
                            %
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5">
                      <span className="text-[10px] text-emerald-300">必备</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agg.required.map(u => (
                          <Champion key={`req-${u}`} id={u} className="sm:size-7.5 size-6" showTooltip />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-300">可选</span>
                      <div className="flex flex-wrap gap-1.5">
                        {optionalShown.map(u => (
                          <Champion key={`opt-${u}`} id={u} className="sm:size-7.5 size-6 opacity-70" showTooltip />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})

Builds.displayName = 'Builds'
