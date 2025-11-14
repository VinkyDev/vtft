/**
 * 日志级别
 */
export const enum LogLevel {
  /**
   * 调试信息
   */
  DEBUG = 'debug',
  /**
   * 日志
   */
  INFO = 'info',
  /**
   * 成功日志
   */
  SUCCESS = 'success',
  /**
   * 非核心功能问题
   */
  WARN = 'warn',
  /**
   * 严重错误
   */
  ERROR = 'error',
  /**
   * 故障
   */
  FATAL = 'fatal',
}

/**
 * 通用日志配置
 */
export interface CommonLogOptions {
  /**
   * 命名空间
   */
  namespace?: string
  /**
   * 作用域
   * 层级：namespace > scope
   */
  scope?: string
  /**
   * 日志级别
   * @default LogLevel.INFO
   */
  level?: LogLevel
  /**
   * 日志消息
   * 输出到浏览器控制台场景下必填。
   * 最终输出到浏览器控制台： ${namespace} ${scope} ${message}
   */
  message?: string
  /**
   * 扩展信息，可用于描述日志的上下文信息
   */
  meta?: Record<string, unknown>
  /**
   * Error
   * 错误日志/事件场景下必填
   */
  error?: Error
}

export type LogOptions = WithRequired<CommonLogOptions, 'message'>

/**
 * 日志上报 Client
 */
export interface LoggerReportClient {
  send: (options: CommonLogOptions) => void
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
