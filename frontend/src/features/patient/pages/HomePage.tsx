import { useEffect } from 'react'
import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { useGetPatientProfile } from '../hooks/usePatientQueries'
import { useGetPatientAppointments } from '../hooks/useAppointmentQueries'
import { useHealthData } from '../hooks/useHealthData'
import { useHealthAlerts } from '../hooks/useHealthAlerts'
import { ProfileCard } from '../components/home/ProfileCard'
import { VitalsGrid } from '../components/home/VitalsGrid'
import { UpcomingAppointment } from '../components/home/UpcomingAppointment'
import { disconnectSocket, initSocket } from '@/lib/socket'
import { useAuthStore } from '@/stores/auth.store'

export const HomePage = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
  const { data: profileData } = useGetPatientProfile()
  const { data: appointmentsData } = useGetPatientAppointments({
    page: 1,
    limit: 5,
    status: ['confirmed', 'pending'],
  })

  const user = useAuthStore((s) => s.user)
  const { healthData, latestData } = useHealthData(user!.id)
  const { alerts } = useHealthAlerts()
  useEffect(() => {
    // Khởi tạo socket khi component mount
    initSocket(user!.id)

    return () => {
      // Disconnect khi unmount
      disconnectSocket()
    }
  }, [user!.id])

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Profile Card */}
      <ProfileCard profileData={profileData} unreadCount={unreadCount} />

      {/* Vitals Grid */}
      <VitalsGrid latestData={latestData} />

      {/* Upcoming Appointment */}
      <UpcomingAppointment appointmentsData={appointmentsData?.data} />
    </div>
  )
}
