import { redirect } from '@tanstack/react-router'

import type { UserRole } from '@/features/auth/types/auth.types'

import {
  selectIsAuthenticated,
  selectIsProfileComplete,
  selectUser,
  useAuthStore,
} from '@/stores/auth.store'

interface RequireAuthOptions {
  location: { href: string }
  roles?: Array<UserRole>
}

/**
 * Route guard yêu cầu user đã authenticated và có role hợp lệ (nếu roles được cung cấp)
 */
export function requireAuth({ location, roles }: RequireAuthOptions) {
  const state = useAuthStore.getState()
  const isAuthenticated = selectIsAuthenticated(state)
  const user = selectUser(state)
  const isProfileComplete = selectIsProfileComplete(state)

  // Check authentication
  if (!isAuthenticated)
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
      replace: true,
    })

  // Check authorization (role-based)
  if (roles && (!user || !roles.includes(user.role)))
    throw redirect({ to: '/unauthorized' })

  // Check profile completion for patient role (except for complete-profile route)
  // Nếu user là patient nhưng chưa hoàn thiện profile, redirect về trang complete-profile, chỉ cho phép truy cập các trang liên quan đến profile
  if (
    user?.role === 'patient' &&
    !isProfileComplete &&
    !location.href.includes('profile')
  )
    throw redirect({
      to: '/patient/complete-profile',
      replace: true,
    })

  return { user }
}
