import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { CalendarPlus } from 'lucide-react'
import { useGetPatientProfile } from '@/features/patient/hooks/usePatientQueries'
import {
  AppointmentCard,
  ProfileCard,
  StatCards,
  VitalCards,
} from '@/features/patient/components/home'
import { MOCK_NOTIFICATIONS } from '@/features/patient/data/mockData'
import { useGetMyAppointments } from '@/features/patient/hooks/useAppointmentQueries'
import { useAuthStore } from '@/stores/auth.store'
import { useHealthData } from '@/features/patient/hooks/useHealthData'
import { useHealthAlerts } from '@/features/patient/hooks/useHealthAlerts'
import { disconnectSocket, initSocket } from '@/lib/socket'
import { Button } from '@/components/ui/button'

export const HomePage = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
  const { data: profileData } = useGetPatientProfile()
  const { data: appointmentsData } = useGetMyAppointments({
    page: 1,
    limit: 5,
    status: ['confirmed'],
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
    <div className="px-4">
      <ProfileCard profileData={profileData} unreadCount={unreadCount} />

      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-12">
        {/* Cột trái */}
        <div className="flex flex-col gap-3 md:gap-6 lg:col-span-8">
          {/* Các thẻ chỉ số cơ bản */}
          <StatCards profileData={profileData} />

          {/* Các thẻ chỉ số sức khỏe */}
          <VitalCards latestData={latestData} />
        </div>

        {/* Cột phải */}
        <div className="mb-3 flex flex-col gap-3 md:gap-6 lg:col-span-4">
          <Link to="/patient/appointments">
            <Button
              variant="teal_primary"
              className="flex h-14 w-full rounded-3xl transition-transform active:scale-[0.98]">
              <CalendarPlus strokeWidth="2.5" className="size-5" />
              <span className="text-base font-semibold">Đặt lịch khám</span>
            </Button>
          </Link>

          <h3 className="text-lg font-bold text-slate-900">Lịch hẹn sắp tới</h3>

          <div className="space-y-3 md:space-y-4">
            {appointmentsData?.data && appointmentsData.data.length > 0 ? (
              appointmentsData.data
                .slice(0, 3)
                .map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))
            ) : (
              <p className="text-center text-gray-500">
                Không có lịch hẹn nào sắp tới.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
