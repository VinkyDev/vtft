import process from 'node:process'

/**
 * 获取任务配置，从环境变量读取
 * 如果环境变量未设置则抛出错误
 */
export function getTaskConfig(taskName: string): { enabled: boolean, schedule: string } {
  const upperName = taskName.toUpperCase()
  const enabledEnvKey = `CRAWLER_${upperName}_ENABLED`
  const scheduleEnvKey = `CRAWLER_${upperName}_SCHEDULE`

  const enabledValue = process.env[enabledEnvKey]
  const scheduleValue = process.env[scheduleEnvKey]

  if (enabledValue === undefined) {
    throw new Error(`环境变量 ${enabledEnvKey} 未设置`)
  }
  if (scheduleValue === undefined) {
    throw new Error(`环境变量 ${scheduleEnvKey} 未设置`)
  }

  return {
    enabled: enabledValue === 'true',
    schedule: scheduleValue,
  }
}

/**
 * 获取必需的环境变量，未设置则抛出错误
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`环境变量 ${key} 未设置`)
  }
  return value
}
