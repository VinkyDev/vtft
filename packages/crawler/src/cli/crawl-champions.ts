#!/usr/bin/env node
import { crawlChampions } from '../crawlers/ChampionCrawler'
import { createCrawlerCLI } from '../lib/createCrawlerCLI'
import { saveChampions } from '../lib/storage'

createCrawlerCLI({
  name: '爬取英雄数据',
  crawlFn: crawlChampions,
  saveFn: saveChampions,
  defaultOptions: {
    headless: true,
    debug: true,
    screenshot: true,
  },
})
