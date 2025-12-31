import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Luôn gửi cookies (cho refresh token)
})

let isRefreshing = false // Cờ đánh dấu đang trong quá trình lấy token mới
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = [] // Hàng đợi chứa các request bị lỗi 401 chờ retry

/**
 * Xử lý các requests đang chờ sau khi refresh token thành công/thất bại
 */
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
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

    // Nếu lỗi không phải 401 hoặc đã retry rồi mà vẫn lỗi -> Trả lỗi luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Nếu request đến endpoint refresh thì không retry nữa
    if (originalRequest.url?.includes('/auth/refresh')) {
      // Refresh token đã hết hạn hoặc invalid
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Nếu đang refresh token thì đưa request vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          const newToken = useAuthStore.getState().accessToken
          // Khi hàng đợi được xả, lấy token mới gắn vào header và gửi lại request
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          return apiClient(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    // Nếu chưa có ai đi lấy token -> Mình là người đầu tiên
    originalRequest._retry = true // Đánh dấu để không lặp vô hạn
    isRefreshing = true

    try {
      // Gọi API refresh token (refresh token trong httpOnly cookie tự động gửi)
      const { data } = await apiClient.post(
        '/auth/refresh-token',
        {},
        {
          withCredentials: true,
        },
      )

      // Lưu access token và user mới vào store
      useAuthStore.getState().setAuth(data.data.accessToken, data.data.user)

      // Xử lý tất cả requests đang chờ
      processQueue(null)

      // Retry request gốc với token mới
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`

      return apiClient(originalRequest)
    } catch (refreshError) {
      // Refresh token thất bại thì logout
      processQueue(refreshError as Error)
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

/**
 * Helper để lấy error message từ API response
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data
    // Ưu tiên lấy error detail (chi tiết lỗi từ BE)
    if (responseData?.error) {
      return responseData.error
    }
    // Sau đó lấy message
    if (responseData?.message) {
      return responseData.message
    }
    // Cuối cùng lấy error message từ axios
    return error.message || 'Có lỗi xảy ra'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Có lỗi xảy ra'
}
