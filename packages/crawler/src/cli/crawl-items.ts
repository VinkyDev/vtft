#!/usr/bin/env node
import process from 'node:process'
import { exit, getArgv, withTimer } from '../core/logger'
import { saveItems } from '../core/storage'
import { crawlItemMeta } from '../crawlers/itemMeta'

// 如果直接运行此文件
if (import.meta.url === `file://${getArgv()[1]}`) {
  // 解析命令行参数
  const args = process.argv.slice(2)
  const shouldSave = args.includes('--save')

  withTimer(
    async () => {
      const items = await crawlItemMeta({
        headless: true,
        debug: true,
        screenshot: true,
      })

      // 如果指定了 --save，保存到数据库
      if (shouldSave) {
        await saveItems(items)
      }

      return items
    },
    '爬取装备元数据',
  )
    .then(() => exit(0))
    .catch(() => exit(1))
}
