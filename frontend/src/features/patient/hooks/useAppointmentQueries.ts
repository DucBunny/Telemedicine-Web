import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentApi } from '../api/appointment.api'
import type { PaginationParams } from '@/types/api.type'

const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { status?: Array<string> }) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,
  details: () => [...APPOINTMENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...APPOINTMENT_KEYS.details(), id] as const,
  myProfile: () => [...APPOINTMENT_KEYS.all, 'my-profile'] as const,
}

/**
 * Hook to get patient's appointments
 */
export const useGetPatientAppointments = (
  params: PaginationParams & { status?: Array<string> },
) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(params),
    queryFn: () => appointmentApi.getPatientAppointments(params),
  })
}
