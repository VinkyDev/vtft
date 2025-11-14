export interface BaseResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
