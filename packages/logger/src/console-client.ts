import type { CommonLogOptions, LoggerReportClient, LogLevel, LogOptions } from './type'
import { isEmpty } from 'lodash-es'

function getColorByLogLevel(type?: LogLevel): string {
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

  // 构建模板字符串和对应的样式
  let template = '%c Logger %c'
  const styles = [
    'background:#444444 ; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
    `background:${getColorByLogLevel(level)}; padding: 1px; border-radius: 0; color: #fff`,
  ]

  // 添加时间部分
  if (withTime) {
    template += ` ${time} %c `
    styles.push('background:transparent')
  }

  // 添加命名空间/级别部分
  template += ` ${namespace || level}`

  // 添加作用域部分
  if (scope) {
    template += ` %c ${scope}`
    styles.push('background:#777777; padding: 1px; border-radius: 0 3px 3px 0; color: #fff; margin-left: -1px;')
  }
  else {
    // 如果没有作用域，调整第二个样式的圆角
    styles[1] = `background:${getColorByLogLevel(level)}; padding: 1px; border-radius: 0 3px 3px 0; color: #fff`
  }

  // 结束标记
  template += ' %c'
  styles.push('background:transparent')

  const logs: unknown[] = [template, ...styles, message]

  const payload = rest.error ? rest : rest.meta
  if (!isEmpty(payload)) {
    logs.push(payload)
  }
  logs.push(...restArgs)

  console.log(...logs)
}

class ConsoleLogClient implements LoggerReportClient {
  send({ meta, message, ...rest }: CommonLogOptions): void {
    // 允许 message 为空字符串，但排除 null 和 undefined
    const resolvedMsg = message !== null && message !== undefined ? message : undefined
    if (resolvedMsg === undefined) {
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
