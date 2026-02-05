import { useQuery } from '@tanstack/react-query'
import { appointmentApi } from '../api/appointment.api'
import type { PaginationParams } from '@/types/api.type'

const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { status?: string }) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,
  details: () => [...APPOINTMENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...APPOINTMENT_KEYS.details(), id] as const,
}

/**
 * Hook to get doctor's appointments
 */
export const useGetDoctorAppointments = (
  params: PaginationParams & { status?: string },
) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(params),
    queryFn: () => appointmentApi.getDoctorAppointments(params),
  })
}
