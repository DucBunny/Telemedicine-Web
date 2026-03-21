import { redirect } from '@tanstack/react-router'
import type { UserRole } from '@/features/auth/types/auth.types'
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth.store'

interface RequireAuthOptions {
  location: { href: string }
  roles?: Array<UserRole>
}

/**
 * Kiểm tra user đã authenticated chưa (có access token và user info)
 */
export function isAuthenticated(): boolean {
  const state = useAuthStore.getState()
  return selectIsAuthenticated(state)
}

/**
 * Route guard yêu cầu user đã authenticated và có role hợp lệ (nếu roles được cung cấp)
 */
export function requireAuth({ location, roles }: RequireAuthOptions) {
  const state = useAuthStore.getState()

  // Check authentication
  if (!isAuthenticated()) {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
      replace: true,
    })
  }

  // Check authorization (role-based)
  if (roles && (!state.user || !roles.includes(state.user.role))) {
    throw redirect({ to: '/unauthorized' })
  }

  // Check profile completion for patient role (except for complete-profile route)
  // Nếu user là patient nhưng chưa hoàn thiện profile, redirect về trang complete-profile, chỉ cho phép truy cập các trang liên quan đến profile
  if (
    state.user?.role === 'patient' &&
    !state.isProfileComplete &&
    !location.href.includes('profile')
  ) {
    throw redirect({
      to: '/patient/complete-profile',
      replace: true,
    })
  }

  return { user: state.user }
}
