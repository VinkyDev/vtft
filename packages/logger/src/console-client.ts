import type { CommonLogOptions, LoggerReportClient, LogLevel, LogOptions } from './type'
import { isEmpty } from 'lodash-es'

export function getColorByLogLevel(type?: LogLevel): string {
  if (type === 'success') {
    return '#00CC00'
  }
  else if (type === 'warning') {
    return '#CC9900'
  }
  else if (type === 'error') {
    return '#CC3333'
  }
  else if (type === 'fatal') {
    return '#FF0000'
  }
  else {
    return '#0099CC'
  }
}

function doConsole(
  { namespace, scope, level, message, withTime = false, ...rest }: LogOptions,
  ...restArgs: unknown[]
): void {
  const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

  const logs: unknown[] = [
    `%c Logger %c ${withTime ? `${time} %c ` : ''}${namespace || level}${
      scope ? ` %c ${scope}` : ''
    } %c`,
    'background:#444444 ; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
    `background:${getColorByLogLevel(level)}; padding: 1px; border-radius: ${
      scope ? '0' : '0 3px 3px 0'
    }; color: #fff`,
    scope
      ? 'background:#777777; padding: 1px; border-radius: 0 3px 3px 0; color: #fff; margin-left: -1px;'
      : 'background:transparent',
  ]

  if (scope) {
    logs.push('background:transparent')
  }

  logs.push(message)
  const payload = rest.error ? rest : rest.meta
  if (!isEmpty(payload)) {
    logs.push(payload)
  }
  logs.push(...restArgs)

  console.log(...logs)
}

export class ConsoleLogClient implements LoggerReportClient {
  send({ meta, message, ...rest }: CommonLogOptions): void {
    const resolvedMsg = message || undefined
    if (!resolvedMsg) {
      return
    }
    const payload = { ...rest, message: resolvedMsg }
    if (meta) {
      doConsole(payload, meta)
    }
    else {
      doConsole(payload)
    }
  }
}

export const consoleLogClient = /* #__PURE__ */ new ConsoleLogClient()
