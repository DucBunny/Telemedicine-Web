import { create } from 'zustand'
import type { AuthUser } from '@/features/auth/types/auth.types'

interface AuthState {
  // State
  accessToken: string | null
  user: AuthUser | null
  isInitialized: boolean

  // Actions
  setAuth: (accessToken: string, user: AuthUser) => void
  clearAuth: () => void
  setInitialized: (initialized: boolean) => void
}

/**
 * Zustand store để quản lý authentication state
 * - accessToken: Lưu trong memory, mất khi refresh page
 * - user: Thông tin user hiện tại
 * - isInitialized: Đánh dấu đã khởi tạo auth chưa (để tránh flash)
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  accessToken: null,
  user: null,
  isInitialized: false,

  // Set cả access token và user (dùng khi login hoặc refresh)
  setAuth: (accessToken: string, user: AuthUser) =>
    set({ accessToken, user, isInitialized: true }),

  // Clear toàn bộ auth state (logout)
  clearAuth: () => set({ accessToken: null, user: null, isInitialized: true }),

  // Set initialized flag
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
}))

// Selectors để sử dụng trong components
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) =>
  !!state.accessToken && !!state.user
export const selectIsInitialized = (state: AuthState) => state.isInitialized
