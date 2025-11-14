import type {
  CommonLogOptions,
  LoggerReportClient,
} from './type'
import { consoleLogClient } from './console-client'
import {
  LogLevel,
} from './type'

function unwrapOptions(payload: string | CommonLogOptions): CommonLogOptions {
  if (typeof payload === 'string') {
    return {
      message: payload,
    }
  }
  return payload
}

// 处理带 error 的参数重载
function unwrapErrorOptions(
  messageOrOptions: string | (CommonLogOptions & { error: Error }),
  errorOrUndefined?: Error,
): CommonLogOptions & { error: Error } {
  if (typeof messageOrOptions === 'string') {
    // logger.error('message', error) 风格
    if (!errorOrUndefined) {
      throw new Error('error parameter is required for error/fatal logs')
    }
    return {
      message: messageOrOptions,
      error: errorOrUndefined,
    }
  }
  // logger.error({ message: 'xxx', error: xxx }) 风格
  return messageOrOptions
}

export type LogOptionsResolver = (
  options: CommonLogOptions,
) => CommonLogOptions

export class Logger<T extends CommonLogOptions = CommonLogOptions> {
  client: LoggerReportClient
  private defaultOptions: Partial<CommonLogOptions>

  constructor(defaultOptions?: Partial<CommonLogOptions>) {
    this.client = consoleLogClient
    this.defaultOptions = defaultOptions ?? {}
  }

  log(options: CommonLogOptions): void {
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
    }
    this.client.send(mergedOptions as CommonLogOptions)
  }

  // error 和 fatal 支持两种调用方式：
  // 1. logger.error('message', error) - 类似标准 console.error
  // 2. logger.error({ message: 'xxx', error: xxx, meta: {...} }) - 完整配置
  fatal(message: string, error: Error): void
  fatal(payload: T & { error: Error }): void
  fatal(messageOrPayload: string | (T & { error: Error }), error?: Error): void {
    this.log({
      ...unwrapErrorOptions(messageOrPayload as any, error),
      level: LogLevel.FATAL,
    })
  }

  error(message: string, error: Error): void
  error(payload: T & { error: Error }): void
  error(messageOrPayload: string | (T & { error: Error }), error?: Error): void {
    this.log({
      ...unwrapErrorOptions(messageOrPayload as any, error),
      level: LogLevel.ERROR,
    })
  }

  debug(payload: string | T): void {
    this.log({
      ...unwrapOptions(payload),
      level: LogLevel.DEBUG,
    })
  }

  info(payload: string | T): void {
    this.log({
      ...unwrapOptions(payload),
      level: LogLevel.INFO,
    })
  }

  success(payload: string | T): void {
    this.log({
      ...unwrapOptions(payload),
      level: LogLevel.SUCCESS,
    })
  }

  warn(payload: string | T): void {
    this.log({
      ...unwrapOptions(payload),
      level: LogLevel.WARN,
    })
  }
}

export const logger = new Logger()
