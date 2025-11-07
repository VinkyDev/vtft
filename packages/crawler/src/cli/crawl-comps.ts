#!/usr/bin/env node
import { crawlComps } from '../crawlers/CompCrawler'
import { createCrawlerCLI } from '../lib/createCrawlerCLI'
import { saveComps } from '../lib/storage'

createCrawlerCLI({
  name: '爬取阵容数据',
  crawlFn: crawlComps,
  saveFn: saveComps,
  defaultOptions: {
    headless: false,
    debug: true,
    screenshot: true,
    fetchDetails: true,
  },
})
