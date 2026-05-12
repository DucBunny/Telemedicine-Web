import { useEffect } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  CancelAppointmentBody,
  CreateAppointmentBody,
  GetAvailableSlotsParams,
  GetMyAppointmentsParams,
  GetPatientAppointmentsParams,
  PatchAppointmentStatusBody,
} from '@/features/appointments/types/appointment.dto'

import { appointmentApi } from '@/features/appointments/api/appointment.api'
import { getErrorMessage } from '@/lib/axios'
import {
  addAppointmentNewListener,
  addAppointmentUpdateListener,
} from '@/stores/systemSocket.store'

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,

  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params: GetMyAppointmentsParams) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,
  listByPatientId: (patientId: number, params: GetPatientAppointmentsParams) =>
    [...APPOINTMENT_KEYS.lists(), 'patient', patientId, params] as const,

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
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to get available slots for a doctor on a date
 */
export const useGetAvailableSlots = (
  params: GetAvailableSlotsParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.slots(params.doctorId, params.date),
    queryFn: () => appointmentApi.getAvailableSlots(params),
    enabled: (options?.enabled ?? true) && !!params.doctorId && !!params.date,
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

/**
 * Hook to confirm an appointment
 */
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => appointmentApi.confirmAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
      toast.success('Xác nhận lịch thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Xác nhận lịch thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to patch appointment status by doctor
 */
export const usePatchAppointmentStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: PatchAppointmentStatusBody
    }) => appointmentApi.patchAppointmentStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
      toast.success('Đã cập nhật trạng thái')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Không thể cập nhật trạng thái')
    },
    retry: false,
  })
}

/**
 * Hook to listen for realtime appointment updates
 */
export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribeNew = addAppointmentNewListener(() => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
    })

    const unsubscribeUpdate = addAppointmentUpdateListener(({ id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.detail(id) })
    })

    return () => {
      unsubscribeNew()
      unsubscribeUpdate()
    }
  }, [queryClient])
}

/**
 * Hook to get appointments by patient ID and current doctor ID
 */
export const useGetAppointmentsByPatientIdAndCurrentDoctor = (
  patientId: number,
  params: GetPatientAppointmentsParams,
) => {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.listByPatientId(patientId, params),
    queryFn: () =>
      appointmentApi.getAppointmentsByPatientIdAndCurrentDoctor(
        patientId,
        params,
      ),
    enabled: !!patientId,
    placeholderData: keepPreviousData,
  })
}
