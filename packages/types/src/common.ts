export interface BaseResult<T> {
  success: boolean
  data?: T
  error?: string
}
