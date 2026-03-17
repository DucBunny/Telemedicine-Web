import { createFileRoute } from '@tanstack/react-router'
import { AppointmentConfirmPage } from '@/features/patient/pages/appointments/AppointmentConfirmPage'

interface ConfirmSearchParams {
  doctorId?: number
  specialtyId?: number
  date?: string
  time?: string
  type?: 'offline' | 'online'
}

export const Route = createFileRoute('/patient/appointments/confirm')({
  validateSearch: (search: Record<string, unknown>): ConfirmSearchParams => {
    return {
      doctorId: Number(search.doctorId) || undefined,
      specialtyId: Number(search.specialtyId) || undefined,
      date: (search.date as string) || undefined,
      time: (search.time as string) || undefined,
      type: search.type as 'offline' | 'online',
    }
  },
  component: AppointmentConfirmPage,
})
