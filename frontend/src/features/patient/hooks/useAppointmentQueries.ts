import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaginationParams } from '@/types/api.type'
import type {
  CancelAppointmentBody,
  CreateAppointmentBody,
  GetAvailableSlotsParams,
  GetMyAppointmentsParams,
} from '@/features/patient/dto/appointment.dto'
import { appointmentApi } from '@/features/patient/api/appointment.api'
import { getErrorMessage } from '@/lib/axios'

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,

  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { status?: Array<string> }) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,

  details: () => [...APPOINTMENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...APPOINTMENT_KEYS.details(), id] as const,

  slots: (doctorId: number, date: string) =>
    [...APPOINTMENT_KEYS.all, 'slots', doctorId, date] as const,
}

/**
 * Hook to get my appointments
 */
export const useGetMyAppointments = (params: GetMyAppointmentsParams) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(params),
    queryFn: () => appointmentApi.getMyAppointments(params),
  })
}

/**
 * Hook to get available slots for a doctor on a date
 */
export const useGetAvailableSlots = (params: GetAvailableSlotsParams) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.slots(params.doctorId, params.date),
    queryFn: () => appointmentApi.getAvailableSlots(params),
    enabled: !!params.doctorId && !!params.date,
  })
}

/**
 * Hook to create an appointment
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAppointmentBody) =>
      appointmentApi.createAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
      toast.success('Đặt lịch thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Đặt lịch thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to cancel an appointment
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: CancelAppointmentBody
    }) => appointmentApi.cancelAppointment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
      toast.success('Hủy lịch thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Hủy lịch thất bại')
    },
    retry: false,
  })
}
