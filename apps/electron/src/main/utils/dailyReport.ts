import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import logger from 'logger'

const LAST_REPORT_FILE = 'last-daily-report.txt'

/**
 * 检查今天是否已经上报过
 */
export function shouldReportToday(): boolean {
  try {
    const userDataPath = app.getPath('userData')
    const reportFilePath = path.join(userDataPath, LAST_REPORT_FILE)
    if (!fs.existsSync(reportFilePath)) {
      return true
    }

    const lastReportDate = fs.readFileSync(reportFilePath, 'utf-8').trim()
    const today = getTodayDate()

    return lastReportDate !== today
  }
  catch (error) {
    logger.error({ message: '检查每日上报状态失败', error })
    return true
  }
}

/**
 * 标记今天已经上报
 */
export function markReportedToday(): void {
  try {
    const userDataPath = app.getPath('userData')
    const reportFilePath = path.join(userDataPath, LAST_REPORT_FILE)
    const today = getTodayDate()

    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true })
    }

    fs.writeFileSync(reportFilePath, today, 'utf-8')
    logger.info(`标记每日上报完成: ${today}`)
  }
  catch (error) {
    logger.error({ message: '标记每日上报失败', error })
  }
}

/**
 * 获取今天的日期字符串 (格式: YYYY-MM-DD)
 * 固定使用北京时间 (UTC+8)
 */
function getTodayDate(): string {
  const now = new Date()
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  const year = beijingTime.getUTCFullYear()
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(beijingTime.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
