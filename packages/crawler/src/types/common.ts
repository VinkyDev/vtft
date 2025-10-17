/** 爬虫配置选项 */
export interface CrawlOptions {
  /** 是否使用无头模式 */
  headless?: boolean
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否保存截图 */
  screenshot?: boolean
}

/** 装备信息 */
export interface Item {
  name: string
  icon: string
}
