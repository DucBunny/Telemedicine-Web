import { createFileRoute } from '@tanstack/react-router'
import { TimeSelectionPage } from '@/features/patient/pages/appointments/TimeSelectionPage'

interface TimePickerSearchParams {
  doctorId?: number
  specialtyId?: number
}

export const Route = createFileRoute('/patient/appointments/time')({
  validateSearch: (search: Record<string, unknown>): TimePickerSearchParams => {
    return {
      doctorId: Number(search.doctorId) || undefined,
      specialtyId: Number(search.specialtyId) || undefined,
    }
  },
  component: TimeSelectionPage,
})
