import { useEffect } from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'

import { authApi } from '@/features/auth/api/auth.api'
import { userApi } from '@/features/users/api/user.api'
import { selectIsInitialized, useAuthStore } from '@/stores/auth.store'
import { usePresenceStore } from '@/stores/presence.store'
import { useSystemSocketStore } from '@/stores/systemSocket.store'

interface MyRouterContext {
  queryClient: QueryClient
}

// Extend the StaticDataRouteOption to include our custom static data
declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    hideMobileNav?: boolean
    hideHeader?: boolean
    title?: string
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const auth = useAuthStore.getState()
    if (auth.isInitialized) return

    try {
      const data = await authApi.refreshToken()
      auth.setAuth(data.accessToken, data.user, data.isProfileComplete)
    } catch {
      auth.clearAuth()
    } finally {
      auth.setInitialized(true)
    }
  },
  component: rootComponent,
})

function rootComponent() {
  const isInitialized = useAuthStore(selectIsInitialized)
  const { pathname } = useLocation()
  const accessToken = useAuthStore((s) => s.accessToken)
  const { connect, disconnect } = useSystemSocketStore()
  const { setInitialStatuses } = usePresenceStore()

  // Kết nối socket khi có token và user
  useEffect(() => {
    let isMounted = true

    const initializeRealtime = async () => {
      // Nếu không có token -> Ngắt kết nối và dừng
      if (!accessToken) {
        disconnect()
        return
      }

      try {
        const data = await userApi.getMyRelatedUsersPresence()
        if (isMounted) setInitialStatuses(data)
      } catch (error) {
        console.error(
          '[Root] Error while loading initial online statuses:',
          error,
        )
      } finally {
        // Bất kể API lỗi hay thành công, luôn mở kết nối Socket sau đó
        if (isMounted) connect()
      }
    }

    initializeRealtime()

    // Ngắt kết nối khi component unmount
    return () => {
      isMounted = false
      disconnect()
    }
  }, [accessToken, connect, disconnect, setInitialStatuses])

  // Cuộn lên đầu trang khi thay đổi route
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '[data-route-scroll-container="true"]',
    )

    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
