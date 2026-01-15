import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth.api'
import { useAuthStore } from '@/stores/auth.store'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const auth = useAuthStore.getState()
    if (auth.isInitialized) return

    try {
      const data = await authApi.refreshToken()
      auth.setAuth(data.accessToken, data.user)
    } catch {
      auth.clearAuth()
    } finally {
      auth.setInitialized(true)
    }
  },
  component: rootComponent,
})

function rootComponent() {
  const isInitialized = useAuthStore((s) => s.isInitialized)

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
