import type { AugmentMeta } from 'types'
import type { AugmentLevelFilter } from './components'
import { Search } from 'lucide-react'
import { pinyin } from 'pinyin-pro'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { useGameDataStore } from '@/store'
import { AugmentCard, AugmentFilter } from './components'

/**
 * 检查文本是否匹配搜索查询（支持拼音搜索）
 */
function matchesSearch(text: string, query: string): boolean {
  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()

  // 直接匹配
  if (lowerText.includes(lowerQuery)) {
    return true
  }

  // 拼音全拼匹配
  const fullPinyin = pinyin(text, { toneType: 'none', type: 'string' }).toLowerCase()
  if (fullPinyin.includes(lowerQuery)) {
    return true
  }

  // 拼音首字母匹配
  const firstLetters = pinyin(text, { pattern: 'first', toneType: 'none', type: 'string' }).toLowerCase()
  if (firstLetters.includes(lowerQuery)) {
    return true
  }

  return false
}

/**
 * 强化符文页面
 */
export function AugmentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<AugmentLevelFilter>('all')

  // 从 store 获取强化符文数据
  const { augments, augmentsLoading: loading } = useGameDataStore()

  // 搜索和分组强化符文
  const groupedAugments = useMemo(() => {
    if (!augments.length)
      return []

    let filteredAugments = augments

    // 按级别筛选
    if (levelFilter !== 'all') {
      filteredAugments = filteredAugments.filter(augment => augment.level === levelFilter)
    }

    // 搜索过滤（支持拼音）
    if (searchQuery.trim()) {
      const query = searchQuery.trim()
      filteredAugments = filteredAugments.filter(augment =>
        matchesSearch(augment.name, query),
      )
    }

    // 按tier分组并排序
    const tierOrder = { OP: 0, S: 1, A: 2, B: 3, C: 4, D: 5 }
    const groupedByTier = filteredAugments.reduce((acc, augment) => {
      const tier = augment.tier || 'D'
      if (!acc[tier]) {
        acc[tier] = []
      }
      acc[tier].push(augment)
      return acc
    }, {} as Record<string, AugmentMeta[]>)

    // 按tier顺序排序并返回分组
    return Object.entries(groupedByTier)
      .sort(([a], [b]) => {
        const aOrder = tierOrder[a as keyof typeof tierOrder] ?? 999
        const bOrder = tierOrder[b as keyof typeof tierOrder] ?? 999
        return aOrder - bOrder
      })
      .map(([tier, augments]) => ({
        tier,
        augments: augments.sort((a, b) => a.name.localeCompare(b.name)),
      }))
  }, [augments, searchQuery, levelFilter])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'OP': return 'text-red-400'
      case 'S': return 'text-orange-400'
      case 'A': return 'text-yellow-400'
      case 'B': return 'text-green-400'
      case 'C': return 'text-blue-400'
      case 'D': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const totalAugments = groupedAugments.reduce((sum, group) => sum + group.augments.length, 0)

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <div className="py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="搜索符文..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-6 pl-7 pr-2 bg-black/20 border border-white/5 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
            />
          </div>
          <AugmentFilter
            levelFilter={levelFilter}
            onLevelFilterChange={setLevelFilter}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          )}
          {!loading && totalAugments === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">
                {searchQuery.trim() ? '未找到匹配的符文' : '暂无强化符文数据'}
              </p>
            </div>
          )}
          {!loading && groupedAugments.length > 0 && (
            <div className="space-y-4">
              {groupedAugments.map(({ tier, augments }) => (
                <div key={tier}>
                  <div className="mb-2">
                    <h2 className={`text-sm font-bold ${getTierColor(tier)} border-b border-white/10 pb-1`}>
                      {tier}
                    </h2>
                  </div>
                  <div
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    }}
                  >
                    {augments.map(augment => (
                      <AugmentCard key={`${augment.name}`} augment={augment} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
