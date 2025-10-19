import type { Page } from 'playwright'
import type { CompData } from 'types'
import * as cheerio from 'cheerio'
import { logger } from '../core/logger'

/**
 * 从 class 中提取英雄费用
 */
function extractCost(classNames: string): number {
  const match = classNames.match(/border-champion-(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 1
}

/**
 * 从 class 中提取羁绊等级
 */
function extractTraitLevel(classNames: string): number {
  const match = classNames.match(/text-meta-trait-(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 1
}

/**
 * 从HTML提取阵容数据
 */
export async function extractCompsFromPage(page: Page): Promise<CompData[]> {
  logger.info('开始提取阵容数据...')

  const html = await page.content()
  const $ = cheerio.load(html)
  const comps: CompData[] = []

  $('li').each((index, element) => {
    const $li = $(element)

    // 检查是否为有效的阵容项
    const championImages = $li.find('img[alt]').filter((_, img) => {
      const alt = $(img).attr('alt')
      return Boolean(alt && alt.length > 1 && alt.length < 50 && !alt.includes('tier'))
    })

    if (championImages.length === 0)
      return

    const comp: CompData = {
      compId: '',
      rank: index + 1,
      name: '',
      traits: [],
      champions: [],
    }

    // 提取阵容名称
    comp.name = $li.find('strong').first().text().trim()

    // 提取评级
    const tierImg = $li.find('img[alt="S"], img[alt="A"], img[alt="B"], img[alt="C"], img[alt="D"]').first()
    if (tierImg.length) {
      comp.tier = tierImg.attr('alt')
    }

    // 提取等级
    const levelText = $li.find('span').filter((_, el) => {
      return Boolean($(el).text().match(/Lv\s*\d+/))
    }).first().text()

    const levelMatch = levelText.match(/Lv\s*(\d+)/)
    if (levelMatch) {
      comp.level = Number.parseInt(levelMatch[1], 10)
      comp.levelType = 'reroll'
    }

    // 提取统计数据
    $li.find('dl').each((_, dl) => {
      const $dl = $(dl)
      const dt = $dl.find('dt').text().trim()
      const dd = $dl.find('dd').text().trim()

      if (dt.includes('平均名次'))
        comp.avgPlace = Number.parseFloat(dd)
      else if (dt.includes('第一名'))
        comp.firstPlaceRate = Number.parseFloat(dd.replace('%', ''))
      else if (dt.includes('前四名'))
        comp.top4Rate = Number.parseFloat(dd.replace('%', ''))
      else if (dt.includes('挑选率'))
        comp.pickRate = Number.parseFloat(dd.replace('%', ''))
    })

    // 提取羁绊
    const traitContainers = $li.find('div[data-tooltip-id="opgg-tooltip"]').filter((_, el) => {
      const src = $(el).find('img').attr('src')
      return Boolean(src?.includes('tft-trait'))
    })

    traitContainers.each((_, trait) => {
      const $trait = $(trait)
      const img = $trait.find('img').first()
      const name = img.attr('alt') || ''
      const icon = img.attr('src') || ''
      const levelSpan = $trait.find('span').first()
      const level = extractTraitLevel(levelSpan.attr('class') || '')
      const count = Number.parseInt(levelSpan.text().trim(), 10) || 0

      if (name) {
        comp.traits.push({ name, icon, level, count })
      }
    })

    // 提取英雄
    const championContainers = $li.find('div.relative').filter((_, el) => {
      const $el = $(el)
      const hasImage = $el.find('img[alt]').length > 0
      const hasCorrectClass = Boolean($el.attr('class')?.includes('h-[32px]') || $el.attr('class')?.includes('h-[50px]'))
      return hasImage && hasCorrectClass
    })

    championContainers.each((_, champContainer) => {
      const $container = $(champContainer)

      const prioritySpan = $container.find('span').first()
      const priority = prioritySpan.text()

      const champImg = $container.find('img[alt]').filter((_, img) => {
        const src = $(img).attr('src') || ''
        return src.includes('tft-champion')
      }).first()

      if (!champImg.length)
        return

      const name = champImg.attr('alt') || ''
      const icon = champImg.attr('src') || ''
      const cost = extractCost(champImg.attr('class') || '')
      const stars = $container.find('svg').filter((_, svg) => {
        return Boolean($(svg).attr('class')?.includes('text-star-'))
      }).length

      // 提取装备
      const items = $container.find('img[alt]').filter((_, img) => {
        const src = $(img).attr('src') || ''
        return src.includes('tft-item')
      }).map((_, itemImg) => ({
        name: $(itemImg).attr('alt') || '',
        icon: $(itemImg).attr('src') || '',
      })).get()

      if (name) {
        comp.champions.push({ name, icon, cost, stars, items, priority })
      }
    })

    // 只添加有效的阵容数据
    if (comp.name && comp.champions.length > 0) {
      comps.push(comp)
    }
  })

  logger.info(`成功提取 ${comps.length} 个阵容`)
  return comps
}
