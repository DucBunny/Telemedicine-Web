import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { PatientLayout } from '@/features/patient/layouts/PatientLayout'

export const Route = createFileRoute('/patient')({
  component: PatientLayoutRoute,
})

const routeToTab = (pathname: string) => {
  if (pathname.startsWith('/patient/appointments')) return 'appointments'
  if (pathname.startsWith('/patient/patients')) return 'patients'
  if (pathname.startsWith('/patient/chat')) return 'chat'
  if (pathname.startsWith('/patient/settings')) return 'settings'
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
