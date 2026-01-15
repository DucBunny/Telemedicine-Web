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

/**
 * Types for paginated API responses
 */
export interface ApiPaginatedResponse<T> {
  success: true
  data: Array<T>
  meta: PaginationMeta
}

/**
 * Types for pagination metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Types for pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
}
