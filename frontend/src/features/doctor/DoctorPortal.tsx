import { useState } from 'react'
import { DoctorLayout } from './layouts/DoctorLayout'
import { DashboardView } from './components/dashboard/DashboardView'
import { ChatView } from './components/chat/ChatView'
import { AppointmentsView } from './components/appointments/AppointmentsView'
import { PatientsView } from './components/patients/PatientsView'
import { SettingsView } from './components/settings/SettingsView'
import './styles/styles.css'

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveTab} />
      case 'appointments':
        return <AppointmentsView />
      case 'patients':
        return <PatientsView />
      case 'chat':
        return <ChatView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView onNavigate={setActiveTab} />
    }
  }

  return (
    <DoctorLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DoctorLayout>
  )
}
