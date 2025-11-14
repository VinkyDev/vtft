#!/usr/bin/env node
import { crawlAugments } from '../crawlers/AugmentCrawler'
import { createCrawlerCLI } from '../lib/createCrawlerCLI'
import { saveAugments } from '../lib/storage'

createCrawlerCLI({
  name: '爬取强化符文数据',
  crawlFn: crawlAugments,
  saveFn: saveAugments,
  defaultOptions: {
    headless: true,
    debug: true,
    screenshot: true,
  },
})
