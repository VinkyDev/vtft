const translations: Record<string, string> = {
  augments: '符文',
  championEnhancements: '果实',
  maxLevel: '最大等级',
  name: '名称',
  minLevel: '最小等级',
  minStage: '最小阶段',
  maxStage: '最大阶段',
  stacking: '叠层',
  weird: '稀有',
  common: '普通',
  trait: '羁绊',
  champion: '英雄专属',
  multiple: '非唯一',
  silver: '白银',
  gold: '黄金',
  prismatic: '棱彩',
}

interface TOptions {
  ignoreCase?: boolean
  autoReplace?: boolean
}

export function t(str: string, options: TOptions = {}): string {
  const { ignoreCase = true, autoReplace = false } = options

  // ---- 忽略大小写 ----
  if (ignoreCase) {
    const lowerTranslations: Record<string, string> = {}
    for (const key in translations) {
      lowerTranslations[key.toLowerCase()] = translations[key]
    }

    const lowerKey = str.toLowerCase()
    if (lowerTranslations[lowerKey]) {
      return lowerTranslations[lowerKey]
    }

    if (autoReplace) {
      let result = str
      for (const key in lowerTranslations) {
        const re = new RegExp(key, 'gi')
        result = result.replace(re, lowerTranslations[key])
      }
      return result
    }

    return str
  }

  // ---- 区分大小写的情况 ----
  if (translations[str]) {
    return translations[str]
  }

  if (autoReplace) {
    let result = str
    for (const key in translations) {
      const re = new RegExp(key, 'g')
      result = result.replace(re, translations[key])
    }
    return result
  }

  return str
}
