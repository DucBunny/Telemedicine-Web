/**
 * Types for API responses
 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: Record<string, any>
}

/**
 * Types for API responses without data
 */
export interface ApiSuccessOnlyResponse {
  success: true
  data?: never
}

/**
 * Types for API error details
 */
export interface ApiErrorDetail {
  code: string
  message: string
  statusCode: number
  details?: any
  stack?: string
}

/**
 * Types for API error responses
 */
export interface ApiErrorResponse {
  success: false
  error: ApiErrorDetail
}
