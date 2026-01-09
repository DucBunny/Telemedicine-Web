import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { requireAuth } from '@/lib/route-guards'
import { DoctorLayout } from '@/features/doctor/layouts/DoctorLayout'

export const Route = createFileRoute('/doctor')({
  beforeLoad: (opts) =>
    requireAuth({ location: opts.location, roles: ['doctor'] }),
  component: DoctorLayoutRoute,
})

const routeToTab = (pathname: string) => {
  if (pathname.startsWith('/doctor/appointments')) return 'appointments'
  if (pathname.startsWith('/doctor/patients')) return 'patients'
  if (pathname.startsWith('/doctor/chat')) return 'chat'
  if (pathname.startsWith('/doctor/settings')) return 'settings'
  return 'dashboard'
}

function DoctorLayoutRoute() {
  const { pathname } = useLocation()
  const activeTab = routeToTab(pathname)

  return (
    <DoctorLayout activeTab={activeTab}>
      <Outlet />
    </DoctorLayout>
  )
}
