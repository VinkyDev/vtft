import type { CommonLogOptions, LoggerReportClient, LogLevel, LogOptions } from './type'
import { isEmpty } from 'lodash-es'

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

// ANSI 颜色代码（用于 Node.js）
const ANSI = {
  reset: '\x1B[0m',
  bold: '\x1B[1m',
  dim: '\x1B[2m',
  // 前景色
  black: '\x1B[30m',
  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',
  // 背景色
  bgBlack: '\x1B[40m',
  bgRed: '\x1B[41m',
  bgGreen: '\x1B[42m',
  bgYellow: '\x1B[43m',
  bgBlue: '\x1B[44m',
  bgMagenta: '\x1B[45m',
  bgCyan: '\x1B[46m',
  bgWhite: '\x1B[47m',
  bgGray: '\x1B[100m',
} as const

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

function getAnsiColorByLogLevel(type?: LogLevel): string {
  if (type === 'success') {
    return ANSI.green
  }
  else if (type === 'warning') {
    return ANSI.yellow
  }
  else if (type === 'error') {
    return ANSI.red
  }
  else if (type === 'fatal') {
    return `${ANSI.bold}${ANSI.red}`
  }
  else {
    return ANSI.cyan
  }
}

// 浏览器
function doConsoleBrowser(
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

// Node.js
function doConsoleNode(
  { namespace, scope, level, message, withTime = false, ...rest }: LogOptions,
  ...restArgs: unknown[]
): void {
  const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  const levelColor = getAnsiColorByLogLevel(level)

  // 构建日志字符串
  let logStr = `${ANSI.bgGray}${ANSI.white} Logger ${ANSI.reset}`
  logStr += ` ${levelColor}${namespace || level}${ANSI.reset}`

  if (scope) {
    logStr += ` ${ANSI.dim}${scope}${ANSI.reset}`
  }

  if (withTime) {
    logStr += ` ${ANSI.dim}[${time}]${ANSI.reset}`
  }

  logStr += ` ${message}`

  const logs: unknown[] = [logStr]

  const payload = rest.error ? rest : rest.meta
  if (!isEmpty(payload)) {
    logs.push(payload)
  }
  logs.push(...restArgs)

  console.log(...logs)
}

function doConsole(
  options: LogOptions,
  ...restArgs: unknown[]
): void {
  if (isBrowser) {
    doConsoleBrowser(options, ...restArgs)
  }
  else {
    doConsoleNode(options, ...restArgs)
  }
}

class ConsoleLogClient implements LoggerReportClient {
  send({ meta, message, ...rest }: CommonLogOptions): void {
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
