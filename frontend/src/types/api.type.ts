// Common API response envelopes
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiSuccessOnlyResponse {
  success: true
  data?: never
}
