import { describe, expect, it } from 'vitest'
import { filterByPinyinSearch, matchPinyinSearch } from './pinyin-search'

describe('matchPinyinSearch', () => {
  describe('汉字子串匹配', () => {
    it('匹配完整汉字', () => {
      expect(matchPinyinSearch('云顶之弈', '云顶之弈')).toBe(true)
    })

    it('匹配汉字前缀', () => {
      expect(matchPinyinSearch('云顶之弈', '云')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', '云顶')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', '云顶之')).toBe(true)
    })

    it('匹配汉字子串（任意位置）', () => {
      expect(matchPinyinSearch('云顶之弈', '顶之')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', '之弈')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', '锻炉')).toBe(true)
    })

    it('不匹配不存在的汉字', () => {
      expect(matchPinyinSearch('云顶之弈', '英雄')).toBe(false)
    })
  })

  describe('拼音全拼智能匹配', () => {
    it('匹配完整拼音', () => {
      expect(matchPinyinSearch('云顶之弈', 'yundingzhiyi')).toBe(true)
    })

    it('匹配拼音前缀', () => {
      expect(matchPinyinSearch('云顶之弈', 'yun')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'yund')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'yunding')).toBe(true)
    })

    it('支持跨字边界匹配（从开头）', () => {
      expect(matchPinyinSearch('便携锻炉', 'bianx')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bianxie')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bianxied')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bianxieduan')).toBe(true)
    })

    it('支持跨字边界匹配（从中间）', () => {
      expect(matchPinyinSearch('云顶之弈', 'dingzhi')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'dingzhiy')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'zhiyi')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'xieduan')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'duanl')).toBe(true)
    })

    it('支持单字拼音匹配', () => {
      expect(matchPinyinSearch('云顶之弈', 'ding')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'yi')).toBe(true)
    })

    it('不匹配不存在的拼音组合', () => {
      // 测试完全不匹配的拼音
      expect(matchPinyinSearch('云顶之弈', 'xyz')).toBe(false)
      expect(matchPinyinSearch('云顶之弈', 'abc')).toBe(false)
      // 测试拼音顺序错误的情况
      expect(matchPinyinSearch('云顶之弈', 'yizhi')).toBe(false) // yi 在 zhi 前面
    })
  })

  describe('拼音首字母智能匹配', () => {
    it('匹配完整首拼', () => {
      expect(matchPinyinSearch('云顶之弈', 'ydzy')).toBe(true)
    })

    it('匹配首拼前缀', () => {
      expect(matchPinyinSearch('云顶之弈', 'y')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'yd')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'ydz')).toBe(true)
    })

    it('匹配首拼子串（从中间开始）', () => {
      expect(matchPinyinSearch('云顶之弈', 'dzy')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'zy')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bxdl')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'xdl')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'dl')).toBe(true)
    })
  })

  describe('撇号分隔符支持', () => {
    it('支持撇号分隔的全拼匹配', () => {
      expect(matchPinyinSearch('便携锻炉', 'bian\'x')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bian\'xie')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'xie\'duan')).toBe(true)
    })

    it('支持撇号分隔的实际拼音场景', () => {
      // 西安：xi'an（撇号用于区分 xian）
      expect(matchPinyinSearch('西安', 'xi\'an')).toBe(true)
      expect(matchPinyinSearch('西安', 'xi\'a')).toBe(true)
    })

    it('支持多个撇号', () => {
      expect(matchPinyinSearch('便携锻炉', 'bian\'xie\'duan')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'b\'x\'d\'l')).toBe(true)
    })

    it('撇号不影响已有的匹配逻辑', () => {
      expect(matchPinyinSearch('便携锻炉', 'bianx')).toBe(true)
      expect(matchPinyinSearch('便携锻炉', 'bian\'x')).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('空查询返回 true', () => {
      expect(matchPinyinSearch('云顶之弈', '')).toBe(true)
    })

    it('纯空格查询返回 true', () => {
      expect(matchPinyinSearch('云顶之弈', '   ')).toBe(true)
    })

    it('忽略查询字符串的前后空格', () => {
      expect(matchPinyinSearch('云顶之弈', ' yun ')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', ' 云 ')).toBe(true)
    })

    it('处理大小写不敏感', () => {
      expect(matchPinyinSearch('云顶之弈', 'YUN')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'YunDing')).toBe(true)
      expect(matchPinyinSearch('云顶之弈', 'YDZY')).toBe(true)
    })

    it('处理单字符文本', () => {
      expect(matchPinyinSearch('云', 'y')).toBe(true)
      expect(matchPinyinSearch('云', 'yun')).toBe(true)
      expect(matchPinyinSearch('云', '云')).toBe(true)
    })
  })

  describe('实际使用场景', () => {
    it('通过首拼匹配英雄', () => {
      expect(matchPinyinSearch('艾希', 'ax')).toBe(true)
      expect(matchPinyinSearch('盖伦', 'gl')).toBe(true)
    })

    it('通过全拼匹配英雄', () => {
      expect(matchPinyinSearch('艾希', 'aixi')).toBe(true)
      expect(matchPinyinSearch('盖伦', 'gailun')).toBe(true)
    })

    it('通过部分拼音匹配', () => {
      expect(matchPinyinSearch('艾希', 'ai')).toBe(true)
      expect(matchPinyinSearch('盖伦', 'gai')).toBe(true)
    })

    it('匹配多字词组', () => {
      expect(matchPinyinSearch('冰川之心', 'bczx')).toBe(true)
      expect(matchPinyinSearch('冰川之心', 'bingchuan')).toBe(true)
      expect(matchPinyinSearch('冰川之心', 'bingchuanzhixin')).toBe(true)
    })
  })
})

describe('filterByPinyinSearch', () => {
  interface Champion {
    name: string
    type: string
  }

  const champions: Champion[] = [
    { name: '艾希', type: '射手' },
    { name: '盖伦', type: '战士' },
    { name: '安妮', type: '法师' },
    { name: '阿狸', type: '法师' },
    { name: '阿卡丽', type: '刺客' },
  ]

  it('通过首拼过滤', () => {
    const result = filterByPinyinSearch(champions, 'ax', item => item.name)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('艾希')
  })

  it('通过全拼过滤', () => {
    const result = filterByPinyinSearch(champions, 'gai', item => item.name)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('盖伦')
  })

  it('过滤多个匹配项', () => {
    const result = filterByPinyinSearch(champions, 'a', item => item.name)
    expect(result.length).toBeGreaterThanOrEqual(3) // 安妮、阿狸、阿卡丽
    expect(result.map(c => c.name)).toContain('安妮')
    expect(result.map(c => c.name)).toContain('阿狸')
    expect(result.map(c => c.name)).toContain('阿卡丽')
  })

  it('空查询返回所有项', () => {
    const result = filterByPinyinSearch(champions, '', item => item.name)
    expect(result).toHaveLength(champions.length)
  })

  it('空格查询返回所有项', () => {
    const result = filterByPinyinSearch(champions, '   ', item => item.name)
    expect(result).toHaveLength(champions.length)
  })

  it('没有匹配项返回空数组', () => {
    const result = filterByPinyinSearch(champions, 'xyz', item => item.name)
    expect(result).toHaveLength(0)
  })

  it('支持自定义提取函数', () => {
    const result = filterByPinyinSearch(champions, '射手', item => item.type)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('艾希')
  })
})
