#!/usr/bin/env node
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { exit, getArgv, withTimer } from './utils'

/**
 * 爬虫 CLI 配置
 */
interface CrawlerCLIConfig<T, TOptions = unknown> {
  /** 任务名称(用于日志显示) */
  name: string
  /** 爬虫函数 */
  crawlFn: (options: TOptions) => Promise<T>
  /** 保存到数据库的函数 */
  saveFn: (data: T) => Promise<void>
  /** 默认爬虫选项 */
  defaultOptions: TOptions
}

/**
 * 创建爬虫 CLI 工具
 *
 * 统一处理命令行参数解析、执行流程和错误处理
 *
 * @example
 * ```ts
 * createCrawlerCLI({
 *   name: '爬取装备元数据',
 *   crawlFn: crawlItemMeta,
 *   saveFn: saveItems,
 *   defaultOptions: { headless: true, debug: true, screenshot: true }
 * })
 * ```
 */
export function createCrawlerCLI<T, TOptions = unknown>(
  config: CrawlerCLIConfig<T, TOptions>,
) {
  // 如果直接运行此文件
  const currentFile = fileURLToPath(import.meta.url)
  const runningFile = getArgv()[1]

  if (currentFile === runningFile) {
    // 解析命令行参数
    const args = process.argv.slice(2)
    const shouldSave = args.includes('--save')

    withTimer(
      async () => {
        const data = await config.crawlFn(config.defaultOptions)

        // 如果指定了 --save，保存到数据库
        if (shouldSave) {
          await config.saveFn(data)
        }

        return data
      },
      config.name,
    )
      .then(() => exit(0))
      .catch(() => exit(1))
  }
}
