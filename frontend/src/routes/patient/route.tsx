import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { requireAuth } from '@/lib/route-guards'
import { PatientLayout } from '@/features/patient/layouts/PatientLayout'

export const Route = createFileRoute('/patient')({
  beforeLoad: (opts) =>
    requireAuth({ location: opts.location, roles: ['patient'] }),
  component: PatientLayoutRoute,
})

const routeToTab = (pathname: string) => {
  if (pathname.startsWith('/patient/appointments')) return 'appointments'
  if (pathname.startsWith('/patient/records')) return 'records'
  if (pathname.startsWith('/patient/notifications')) return 'notifications'
  if (pathname.startsWith('/patient/patients')) return 'patients'
  if (pathname.startsWith('/patient/chat')) return 'chat'
  if (pathname.startsWith('/patient/profile')) return 'profile'
  return 'home'
}

function PatientLayoutRoute() {
  const { pathname } = useLocation()
  const activeTab = routeToTab(pathname)

  return (
    <PatientLayout activeTab={activeTab}>
      <Outlet />
    </PatientLayout>
  )
}
