import type { Context, Next } from 'hono'

export interface ErrorResponse {
  success: false
  message: string
  error?: string
  stack?: string
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  }
  catch (error) {
    console.error('Error:', error)

    let statusCode = 500
    let message = 'Internal server error'
    let errorDetail: string | undefined

    if (error instanceof APIError) {
      statusCode = error.statusCode
      message = error.message
    }
    else if (error instanceof Error) {
      message = error.message
      errorDetail = error.stack
    }
    else if (typeof error === 'string') {
      message = error
    }

    const response: ErrorResponse = {
      success: false,
      message,
    }

    // 开发环境返回详细错误
    if (process.env.NODE_ENV === 'development') {
      if (errorDetail) {
        response.error = errorDetail
      }
      if (error instanceof Error && error.stack) {
        response.stack = error.stack
      }
    }

    return c.json(response, statusCode as any)
  }
}
