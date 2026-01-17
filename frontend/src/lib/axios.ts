import axios from 'axios'
import {
  getSystemErrorMessage,
  getVietnameseErrorMessage,
} from './error-messages'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorResponse } from '@/types/api.type'
import { useAuthStore } from '@/stores/auth.store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Luôn gửi cookies (cho refresh token)
})

// Auth endpoints không cần auto-refresh token khi gặp 401
const AUTH_ENDPOINTS_NO_RETRY = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
]

let isRefreshing = false // Cờ đánh dấu đang trong quá trình lấy token mới
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = [] // Hàng đợi chứa các request bị lỗi 401 chờ retry

/**
 * Kiểm tra xem request có phải endpoint auth không cần retry
 */
const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false
  return AUTH_ENDPOINTS_NO_RETRY.some((endpoint) => url.includes(endpoint))
}

/**
 * Xử lý các requests đang chờ sau khi refresh token thành công/thất bại
 */
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()))
  failedQueue = []
}

/**
 * Retry request với access token mới
 */
const retryRequestWithNewToken = (
  request: InternalAxiosRequestConfig,
  token: string,
) => {
  request.headers.Authorization = `Bearer ${token}`
  return apiClient(request)
}

/**
 * Handle refresh token flow
 */
const handleRefreshToken = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
) => {
  originalRequest._retry = true
  isRefreshing = true

  try {
    const { data } = await apiClient.post(
      '/auth/refresh-token',
      {},
      { withCredentials: true },
    )

    const { accessToken, user } = data.data
    useAuthStore.getState().setAuth(accessToken, user)
    processQueue(null)

    return retryRequestWithNewToken(originalRequest, accessToken)
  } catch (refreshError) {
    processQueue(refreshError as Error)
    useAuthStore.getState().clearAuth()
    window.location.href = '/login'
    throw refreshError
  } finally {
    isRefreshing = false
  }
}

/**
 * Request Interceptor - Tự động thêm access token vào header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

/**
 * Response Interceptor - Auto refresh token khi gặp 401
 */
apiClient.interceptors.response.use(
  (response) => response, // Nếu thành công thì trả về luôn
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    const is401 = error.response?.status === 401
    const shouldSkipRetry =
      !is401 || originalRequest._retry || isAuthEndpoint(originalRequest.url)

    // Skip retry nếu không phải 401, đã retry, hoặc là auth endpoint
    if (shouldSkipRetry) {
      // Clear auth nếu refresh token endpoint bị 401
      if (is401 && originalRequest.url?.includes('/auth/refresh')) {
        useAuthStore.getState().clearAuth()
      }
      return Promise.reject(error)
    }

    // Nếu đang refresh, đưa vào queue và chờ
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => {
        const newToken = useAuthStore.getState().accessToken
        return newToken
          ? retryRequestWithNewToken(originalRequest, newToken)
          : Promise.reject(new Error('No token available'))
      })
    }

    // Thực hiện refresh token
    return handleRefreshToken(originalRequest)
  },
)

/**
 * Helper để lấy error message từ API response
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse | undefined

    // Ưu tiên translate error code sang tiếng Việt
    if (apiError?.error.code) {
      return getVietnameseErrorMessage(
        apiError.error.code,
        apiError.error.message,
      )
    }

    if (error.message) {
      return getSystemErrorMessage(error)
    }
  }

  if (error instanceof Error) {
    return getSystemErrorMessage(error)
  }

  return getVietnameseErrorMessage('UNKNOWN_ERROR')
}
