import type { CommonLogOptions, LoggerReportClient, LogLevel, LogOptions } from './type'
import { isEmpty } from 'lodash-es'

const isBrowser = typeof (globalThis as any).window !== 'undefined' && typeof (globalThis as any).window.document !== 'undefined'

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
  if (type === 'debug') {
    return '#999999'
  }
  else if (type === 'success') {
    return '#00CC00'
  }
  else if (type === 'warn') {
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

function getAnsiBgColorByLogLevel(type?: LogLevel): string {
  if (type === 'debug') {
    return ANSI.bgGray
  }
  else if (type === 'success') {
    return ANSI.bgGreen
  }
  else if (type === 'warn') {
    return ANSI.bgYellow
  }
  else if (type === 'error') {
    return ANSI.bgRed
  }
  else if (type === 'fatal') {
    return ANSI.bgRed
  }
  else {
    return ANSI.bgCyan
  }
}

function getLevelLabel(type?: LogLevel): string {
  if (type === 'debug') {
    return 'DEBUG'
  }
  else if (type === 'success') {
    return 'SUCCESS'
  }
  else if (type === 'warn') {
    return 'WARN'
  }
  else if (type === 'error') {
    return 'ERROR'
  }
  else if (type === 'fatal') {
    return 'FATAL'
  }
  else {
    return 'INFO'
  }
}

// 固定宽度对齐
const LEVEL_WIDTH = 7
const NAMESPACE_WIDTH = 10
const SCOPE_WIDTH = 20

function padEnd(str: string, width: number): string {
  return str.padEnd(width, ' ')
}

// 浏览器环境
function doConsoleBrowser(
  { namespace, scope, level, message, ...rest }: LogOptions,
  ...restArgs: unknown[]
): void {
  // 构建模板字符串和对应的样式
  let template = '%c'
  const styles: string[] = []

  const levelLabel = getLevelLabel(level)
  const hasNamespaceOrScope = Boolean(namespace || scope)

  // 基础样式：使用 inline-block 和固定宽度实现对齐
  const baseStyle = 'display: inline-block; text-align: center; padding: 1px 4px; color: #fff;'

  // 第一个部分：固定显示日志级别（SUCCESS/WARN/ERROR/FATAL/INFO），固定宽度
  if (hasNamespaceOrScope) {
    // 有 namespace 或 scope 时，左圆角
    template += ` ${levelLabel} %c`
    styles.push(`${baseStyle} background:${getColorByLogLevel(level)}; min-width: 56px; border-radius: 3px 0 0 3px;`)
  }
  else {
    // 没有 namespace 和 scope 时，全圆角
    template += ` ${levelLabel} %c`
    styles.push(`${baseStyle} background:${getColorByLogLevel(level)}; min-width: 56px; border-radius: 3px;`)
  }

  // 添加 namespace 部分
  if (namespace && scope) {
    // 有 namespace 和 scope，namespace 无圆角
    template += ` %c ${namespace} %c`
    styles.push('background:transparent')
    styles.push(`${baseStyle} background:#555555; min-width: 80px; border-radius: 0; margin-left: -1px;`)
  }
  else if (namespace) {
    // 只有 namespace，右圆角
    template += ` %c ${namespace} %c`
    styles.push('background:transparent')
    styles.push(`${baseStyle} background:#555555; min-width: 80px; border-radius: 0 3px 3px 0; margin-left: -1px;`)
  }

  // 添加 scope 部分
  if (scope) {
    // scope 作为最后一个部分，右圆角
    template += ` %c ${scope} %c`
    styles.push('background:transparent')
    styles.push(`${baseStyle} background:#777777; min-width: 120px; border-radius: 0 3px 3px 0; margin-left: -1px;`)
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

  // eslint-disable-next-line no-console
  console.log(...logs)
}

// Node.js 环境固定显示时间
function doConsoleNode(
  { namespace, scope, level, message, ...rest }: LogOptions,
  ...restArgs: unknown[]
): void {
  const time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  const levelBgColor = getAnsiBgColorByLogLevel(level)
  const levelLabel = getLevelLabel(level)

  // 构建日志字符串，使用固定宽度对齐每个部分
  // 日志级别部分：固定宽度，背景色
  let logStr = `${levelBgColor}${ANSI.white} ${padEnd(levelLabel, LEVEL_WIDTH)} ${ANSI.reset}`

  // 添加 namespace：固定宽度，青色
  if (namespace) {
    logStr += ` ${ANSI.cyan}${padEnd(namespace, NAMESPACE_WIDTH)}${ANSI.reset}`
  }
  else {
    // 没有 namespace 时用空格填充，保持对齐
    logStr += ` ${padEnd('', NAMESPACE_WIDTH)}`
  }

  // Node.js 环境固定显示时间
  logStr += ` ${ANSI.dim}[${time}]${ANSI.reset}`

  // 添加 scope：固定宽度，暗色
  if (scope) {
    logStr += ` ${ANSI.dim}${padEnd(scope, SCOPE_WIDTH)}${ANSI.reset}`
  }
  else {
    // 没有 scope 时用空格填充，保持对齐
    logStr += ` ${padEnd('', SCOPE_WIDTH)}`
  }

  logStr += ` ${message}`

  const logs: unknown[] = [logStr]

  const payload = rest.error ? rest : rest.meta
  if (!isEmpty(payload)) {
    logs.push(payload)
  }
  logs.push(...restArgs)

  // eslint-disable-next-line no-console
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
