#!/usr/bin/env node
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { exit, getArgv, withTimer } from '../core/logger'
import { saveComps } from '../core/storage'
import { crawlComps } from '../crawlers/comp'

// 如果直接运行此文件
const currentFile = fileURLToPath(import.meta.url)
const runningFile = getArgv()[1]
if (currentFile === runningFile) {
  // 解析命令行参数
  const args = process.argv.slice(2)
  const shouldSave = args.includes('--save')

  withTimer(
    async () => {
      const comps = await crawlComps({
        headless: false,
        debug: true,
        screenshot: true,
        fetchDetails: true,
      })

      // 如果指定了 --save，保存到数据库
      if (shouldSave) {
        await saveComps(comps)
      }

      return comps
    },
    '爬取阵容数据',
  )
    .then(() => exit(0))
    .catch(() => exit(1))
}
