import process from 'node:process'

export function getTaskConfig(
  taskName: string,
  defaultSchedule: string,
  defaultEnabled: boolean = true,
): { enabled: boolean, schedule: string } {
  const enabledEnvKey = `CRAWLER_${taskName.toUpperCase()}_ENABLED`
  const scheduleEnvKey = `CRAWLER_${taskName.toUpperCase()}_SCHEDULE`
  return {
    enabled: process.env[enabledEnvKey] === 'false' ? false : defaultEnabled,
    schedule: process.env[scheduleEnvKey] || defaultSchedule,
  }
}
