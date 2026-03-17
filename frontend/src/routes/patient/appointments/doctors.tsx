import { createFileRoute } from '@tanstack/react-router'
import { DoctorSelectionPage } from '@/features/patient/pages/appointments/DoctorSelectionPage'

interface DoctorsSearchParams {
  specialtyId?: number
  specialtyName?: string
}

export const Route = createFileRoute('/patient/appointments/doctors')({
  validateSearch: (search: Record<string, unknown>): DoctorsSearchParams => {
    return {
      specialtyId: Number(search.specialtyId) || undefined,
      specialtyName: (search.specialtyName as string) || undefined,
    }
  },
  component: DoctorSelectionPage,
})
