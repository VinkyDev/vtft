import type { Option } from 'types'
import { ChevronRightIcon } from 'lucide-react'
import { memo, useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from 'ui'
import { Champion, EmptyState } from '@/components'
import { useUnitsUtils } from '@/hooks'

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

// 找出多个配置中都有的英雄（交集）
function findCommonUnits(builds: Array<{ units: string[] }>): string[] {
  if (builds.length === 0)
    return []
  if (builds.length === 1)
    return builds[0]!.units

  const unitSets = builds.map(build => new Set(build.units))
  const firstSet = unitSets[0]!

  return Array.from(firstSet).filter(unit =>
    unitSets.every(set => set.has(unit)),
  )
}

// 对齐显示：将英雄列表对齐到统一顺序
function alignUnits(units: string[], commonUnits: string[]): { common: (string | null)[], others: string[] } {
  const unitSet = new Set(units)
  const commonAligned = commonUnits.map(u => unitSet.has(u) ? u : null)
  const others = units.filter(u => !commonUnits.includes(u))
  return { common: commonAligned, others }
}

export const Builds = memo(({ earlyOptions, options }: BuildsProps) => {
  const { sortUnitsByCost } = useUnitsUtils()
  const earlyEntries = useMemo(() => Object.entries(earlyOptions || {}), [earlyOptions])
  const lateEntries = useMemo(() => Object.entries(options || {}).sort((a, b) => Number(a[0]) - Number(b[0])), [options])

  // 检查后期阵容是否有7级
  const hasLateLevel7 = useMemo(() => {
    return lateEntries.some(([lvl]) => lvl === '7')
  }, [lateEntries])

  // 处理早期阵容：每个等级只显示场次最多的配置，其他作为可选项
  const processedEarlyEntries = useMemo(() => {
    return earlyEntries
      .filter(([key]) => !hasLateLevel7 || key !== '7') // 如果后期阵容有7级，则过滤掉早期阵容的7级
      .map(([key, opts]) => {
        // 按场次排序
        const sorted = [...opts].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        const primary = sorted[0]
        const alternatives = sorted.slice(1)

        return {
          key,
          primary: primary
            ? {
                units: sortUnitsByCost(parseUnitList(primary.unit_list)),
                count: primary.count ?? 0,
                avg: primary.avg,
                win: primary.win,
              }
            : null,
          alternatives: alternatives.map(opt => ({
            units: sortUnitsByCost(parseUnitList(opt.unit_list)),
            count: opt.count ?? 0,
            avg: opt.avg,
            win: opt.win,
          })),
        }
      })
  }, [earlyEntries, hasLateLevel7, sortUnitsByCost])

  // 处理后期阵容：按场次排序，每个等级只保留前5个配置
  const processedLateEntries = useMemo(() => {
    return lateEntries
      .filter(([lvl]) => lvl !== '11') // 过滤掉11级
      .filter(([, opts]) => opts.length > 0) // 过滤掉空配置
      .map(([lvl, opts]) => {
        // 按场次排序，只保留前5个
        const sorted = [...opts].sort((a, b) => (b.count ?? 0) - (a.count ?? 0)).slice(0, 5)
        const builds = sorted.map(opt => ({
          units: sortUnitsByCost(parseUnitList(opt.unit_list)),
          count: opt.count ?? 0,
          avg: opt.avg,
          win: opt.win,
        }))

        // 找出所有配置中都有的英雄
        const commonUnits = sortUnitsByCost(findCommonUnits(builds))

        return {
          lvl,
          builds,
          commonUnits,
        }
      })
  }, [lateEntries, sortUnitsByCost])

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
      <ScrollArea className="h-[calc(100vh-55px)] sm:h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-3 p-2 px-4">
          {processedEarlyEntries.length > 0 && (
            <div className="space-y-1.5">
              {processedEarlyEntries.map(({ key, primary, alternatives }) => {
                if (!primary)
                  return null

                return (
                  <div key={key} className="rounded-md bg-white/5 border border-white/5 px-3 py-2 flex items-center justify-between gap-2 transition-all hover:bg-white/8 hover:border-white/10">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs text-gray-400 shrink-0 w-6 text-left font-medium">{key}</span>
                      <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                        {primary.units.map(unit => (
                          <Champion key={`${key}-${unit}`} id={unit} className="sm:size-7.5 size-6" showTooltip />
                        ))}
                        {alternatives.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-white/10">
                                <div className="text-[10px] text-gray-400 font-medium">
                                  +
                                  {Math.min(alternatives.length, 3)}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-black/95 text-white border-white/10 p-2 max-w-[300px]"
                            >
                              <div className="space-y-2">
                                {alternatives.slice(0, 3).map((alt) => {
                                  const altKey = `${key}-alt-${alt.count}-${alt.units.join('-')}`
                                  return (
                                    <div key={altKey} className="space-y-1">
                                      <div className="flex items-center gap-1 flex-wrap">
                                        {alt.units.map(unit => (
                                          <Champion key={`${altKey}-${unit}`} id={unit} className="size-5" showTooltip />
                                        ))}
                                      </div>
                                      <div className="text-[10px] text-gray-400 flex gap-2">
                                        {alt.avg !== undefined && (
                                          <span>
                                            平均:
                                            {formatAvg(alt.avg)}
                                          </span>
                                        )}
                                        {alt.count !== undefined && (
                                          <span>
                                            场次:
                                            {alt.count}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    {primary.avg !== undefined && (
                      <div className="hidden sm:flex items-center text-[10px] text-gray-400 shrink-0">
                        <span>{formatAvg(primary.avg)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {processedEarlyEntries.length > 0 && processedLateEntries.length > 0 && (
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
            </div>
          )}

          {processedLateEntries.length > 0 && (
            <div className="space-y-1.5">
              {processedLateEntries.map(({ lvl, builds, commonUnits }) => (
                <Accordion key={lvl} type="single" collapsible className="w-full">
                  <AccordionItem value={lvl} className="border-0">
                    <AccordionTrigger className="group rounded-md bg-white/5 border border-white/5 px-3 py-2 transition-all hover:bg-white/8 hover:border-white/10 hover:no-underline">
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs text-gray-400 shrink-0 w-6 text-left font-medium">{lvl}</span>
                          {builds[0] && (() => {
                            const aligned = alignUnits(builds[0].units, commonUnits)
                            return (
                              <>
                                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                  {aligned.common.map((unit, idx) => {
                                    const unitKey = unit || `empty-${commonUnits[idx]}`
                                    return unit
                                      ? (
                                          <Champion key={`${lvl}-first-common-${unit}`} id={unit} className="sm:size-7.5 size-6" showTooltip />
                                        )
                                      : (
                                          <div key={`${lvl}-first-empty-${unitKey}`} className="sm:size-7.5 size-6" />
                                        )
                                  })}
                                  {aligned.others.map(unit => (
                                    <Champion key={`${lvl}-first-other-${unit}`} id={unit} className="sm:size-7.5 size-6" showTooltip />
                                  ))}
                                </div>
                              </>
                            )
                          })()}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <ChevronRightIcon className="size-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-1.5 pt-1.5 pb-0">
                      {builds.map((build) => {
                        const buildKey = `${lvl}-build-${build.count}-${build.units.join('-')}`
                        const aligned = alignUnits(build.units, commonUnits)
                        return (
                          <div key={buildKey} className="rounded-md bg-white/5 border border-white/5 px-3 py-2 flex items-center justify-between gap-2 transition-all hover:bg-white/8 hover:border-white/10">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-6 shrink-0" />
                              <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                {aligned.common.map((unit, idx) => {
                                  const unitKey = unit || `empty-${commonUnits[idx]}`
                                  return unit
                                    ? (
                                        <Champion key={`${buildKey}-common-${unit}`} id={unit} className="sm:size-7.5 size-6" showTooltip />
                                      )
                                    : (
                                        <div key={`${buildKey}-empty-${unitKey}`} className="sm:size-7.5 size-6" />
                                      )
                                })}
                                {aligned.others.length > 0 && (
                                  <>
                                    {aligned.common.some(Boolean) && (
                                      <div className="w-px h-4 bg-white/10 mx-0.5" />
                                    )}
                                    {aligned.others.map(unit => (
                                      <Champion key={`${buildKey}-other-${unit}`} id={unit} className="sm:size-7.5 size-6" showTooltip />
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                            {build.avg !== undefined && (
                              <div className="hidden sm:flex items-center text-[10px] text-gray-400 shrink-0">
                                <span>{formatAvg(build.avg)}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
})

Builds.displayName = 'Builds'
