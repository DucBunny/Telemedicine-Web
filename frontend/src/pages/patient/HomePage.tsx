import type { Patient } from '@/features/patients/types'

import { useRealtimeAppointments } from '@/features/appointments/hooks/useAppointmentQueries'
import {
  HealthMonitorCard,
  ProfileCard,
  VitalCardsGrid,
} from '@/features/dashboard/components/patient'
import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { selectUser, useAuthStore } from '@/stores/auth.store'

export const HomePage = () => {
  const { data: profileData } = useGetProfile<Patient>()
  useRealtimeAppointments()

  const user = useAuthStore(selectUser)

  return (
    <div className="px-4 py-4 md:py-0">
      <ProfileCard profileData={profileData} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-10">
        <div className="min-h-0 lg:col-span-7 2xl:col-span-8">
          <VitalCardsGrid patientId={user!.id} />
        </div>

        <div className="min-h-0 lg:col-span-3 2xl:col-span-2">
          <HealthMonitorCard className="h-full" />
        </div>
      </div>
    </div>
  )
}
