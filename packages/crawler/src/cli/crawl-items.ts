#!/usr/bin/env node
import { crawlItemMeta } from '../crawlers/ItemMetaCrawler'
import { createCrawlerCLI } from '../lib/createCrawlerCLI'
import { saveItems } from '../lib/storage'

createCrawlerCLI({
  name: '爬取装备元数据',
  crawlFn: crawlItemMeta,
  saveFn: saveItems,
  defaultOptions: {
    headless: true,
    debug: true,
    screenshot: true,
  },
})
