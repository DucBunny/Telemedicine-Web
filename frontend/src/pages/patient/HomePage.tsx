import { Link } from '@tanstack/react-router'
import { CalendarPlus } from 'lucide-react'

import type { Patient } from '@/features/patients/types'

import {
  useGetMyAppointments,
  useRealtimeAppointments,
} from '@/features/appointments/hooks/useAppointmentQueries'
import {
  AppointmentCard,
  ProfileCard,
  StatCards,
  VitalCardsGrid,
} from '@/features/dashboard/components/patient'
import { useGetUnreadNotificationCount } from '@/features/notifications/hooks/useNotificationQueries'
import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { Button } from '@/components/ui/button'
import { selectUser, useAuthStore } from '@/stores/auth.store'

export const HomePage = () => {
  const { data: profileData } = useGetProfile<Patient>()
  const { data: appointmentsData } = useGetMyAppointments({
    page: 1,
    limit: 3,
    status: ['confirmed'],
  })
  useRealtimeAppointments()
  const { data: unreadCount } = useGetUnreadNotificationCount()

  const user = useAuthStore(selectUser)

  return (
    <div className="px-4">
      <ProfileCard profileData={profileData} unreadCount={unreadCount} />

      <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-12">
        {/* Cột trái */}
        <div className="flex flex-col gap-3 md:gap-4 lg:col-span-12">
          {/* Các thẻ chỉ số cơ bản */}
          <StatCards profileData={profileData} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Chỉ số sức khỏe
              </h3>
            </div>

            <VitalCardsGrid patientId={user!.id} />
          </div>
        </div>

        {/* Cột phải */}
        {/* <div className="mb-3 flex flex-col gap-3 md:gap-6 lg:col-span-4">
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
            {appointmentsData && appointmentsData.data.length > 0 ? (
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
        </div> */}
      </div>
    </div>
  )
}
