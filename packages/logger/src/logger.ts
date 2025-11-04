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

  fatal(payload: T & { error: Error }): void {
    this.log({
      ...payload,
      level: LogLevel.FATAL,
    })
  }

  error(payload: T & { error: Error }): void {
    this.log({
      ...payload,
      level: LogLevel.ERROR,
    })
  }

  warning(payload: string | T): void {
    this.log({
      ...unwrapOptions(payload),
      level: LogLevel.WARNING,
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
}
