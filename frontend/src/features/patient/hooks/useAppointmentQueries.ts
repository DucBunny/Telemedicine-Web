import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentApi } from '../api/appointment.api'
import { doctorApi } from '../api/doctor.api'
import type { PaginationParams } from '@/types/api.type'

const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { status?: Array<string> }) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,
  details: () => [...APPOINTMENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...APPOINTMENT_KEYS.details(), id] as const,
  slots: (doctorId: number, date: string) =>
    [...APPOINTMENT_KEYS.all, 'slots', doctorId, date] as const,
}

const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  list: (params?: object) => [...DOCTOR_KEYS.all, 'list', params] as const,
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

/**
 * Hook to get available slots for a doctor on a date
 */
export const useGetAvailableSlots = (doctorId: number | null, date: string) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.slots(doctorId ?? 0, date),
    queryFn: () => appointmentApi.getAvailableSlots(doctorId!, date),
    enabled: !!doctorId && !!date,
  })
}

/**
 * Hook to get all doctors list
 */
export const useGetDoctors = (params?: {
  page?: number
  limit?: number
  search?: string
  specialty_id?: number | null
}) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(params),
    queryFn: () => doctorApi.getAllDoctors(params),
  })
}

/**
 * Hook to book an appointment
 */
export const useBookAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentApi.bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    },
  })
}
