import { create } from 'zustand'

import type { User } from '@/features/auth/types/auth.types'

interface AuthStore {
  // State
  accessToken: string | null
  user: User | null
  isInitialized: boolean
  isProfileComplete: boolean

  // Actions
  setAuth: (
    accessToken: string,
    user: User,
    isProfileComplete?: boolean,
  ) => void
  clearAuth: () => void
  setInitialized: (initialized: boolean) => void
  setProfileComplete: (isComplete: boolean) => void
}

/**
 * Zustand store để quản lý authentication state
 * - accessToken: Lưu trong memory, mất khi refresh page
 * - user: Thông tin user hiện tại
 * - isInitialized: Đánh dấu đã khởi tạo auth chưa (để tránh flash)
 * - isProfileComplete: Đánh dấu user đã hoàn thiện hồ sơ chưa (dùng cho patient)
 */
export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  accessToken: null,
  user: null,
  isInitialized: false,
  isProfileComplete: true,

  // Set cả access token và user (dùng khi login hoặc refresh)
  setAuth: (
    accessToken: string,
    user: User,
    isProfileComplete: boolean = true,
  ) => set({ accessToken, user, isInitialized: true, isProfileComplete }),

  // Clear toàn bộ auth state (logout)
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isInitialized: true,
      isProfileComplete: true,
    }),

  // Set initialized flag
  setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),

  // Set profile complete flag
  setProfileComplete: (isComplete: boolean) =>
    set({ isProfileComplete: isComplete }),
}))

// Selectors để sử dụng trong components
export const selectUser = (state: AuthStore) => state.user
export const selectIsAuthenticated = (state: AuthStore) =>
  !!state.accessToken && !!state.user
export const selectIsInitialized = (state: AuthStore) => state.isInitialized
export const selectIsProfileComplete = (state: AuthStore) =>
  state.isProfileComplete
