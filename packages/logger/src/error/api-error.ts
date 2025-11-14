import { stringifyJSON } from 'utils'

export interface ApiErrorOption {
  httpStatus: string
  /**
   * 业务 code
   */
  code?: string
  message?: string
  requestConfig?: Record<string, unknown>
  response?: Record<string, unknown>
  /**
   * 错误类型，用于细化监控
   * @default ErrorType.ApiError
   */
  errorType?: string
}

export class ApiError extends Error {
  errorOption: ApiErrorOption

  constructor(option: ApiErrorOption) {
    super(
      `httpStatus=${option.httpStatus}, code=${option.code}, message=${option.message}`,
    )
    this.name = 'ApiError'
    this.errorOption = option
  }
}

export function getApiErrorRecord(error: ApiError | Error): Record<string, unknown> {
  if (error instanceof ApiError && error.errorOption) {
    const { errorOption } = error
    return {
      httpStatus: errorOption.httpStatus,
      code: errorOption.code,
      response: stringifyJSON(errorOption.response),
      requestConfig: stringifyJSON(errorOption.requestConfig),
    }
  }
  return {}
}
