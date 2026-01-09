import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { AdminLayout } from '@/features/admin/layouts/AdminLayout'

export const Route = createFileRoute('/admin')({
  component: DoctorLayoutRoute,
})

const routeToTab = (pathname: string) => {
  if (pathname.startsWith('/admin/users')) return 'users'
  if (pathname.startsWith('/admin/devices')) return 'devices'
  if (pathname.startsWith('/admin/settings')) return 'settings'
  return 'dashboard'
}

function DoctorLayoutRoute() {
  const { pathname } = useLocation()
  const activeTab = routeToTab(pathname)

  return (
    <AdminLayout activeTab={activeTab}>
      <Outlet />
    </AdminLayout>
  )
}
