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
    })
  }

  // Check authorization (role-based)
  if (roles && (!state.user || !roles.includes(state.user.role))) {
    throw redirect({ to: '/unauthorized' })
  }

  return { user: state.user }
}
