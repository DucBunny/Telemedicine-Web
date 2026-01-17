import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { PatientSidebar } from '../components/PatientSidebar'
import { MobileNav } from '../components/MobileNav'

interface DoctorLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export const PatientLayout = ({ children, activeTab }: DoctorLayoutProps) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Desktop Sidebar */}
      <PatientSidebar activeTab={activeTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <main className="h-full flex-1 overflow-y-auto scroll-smooth md:ml-72">
        <div className="mx-auto max-w-4xl px-4 md:px-8 md:pt-8">{children}</div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} />
    </div>
  )
}
