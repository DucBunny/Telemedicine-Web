import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '@/types/api.type'
import { doctorApi } from '@/features/patient/api/doctor.api'

export const DOCTOR_KEYS = {
  all: ['doctors'] as const,

  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (
    params: PaginationParams & { specialtyId?: number; search?: string },
  ) => [...DOCTOR_KEYS.lists(), params] as const,

  details: () => [...DOCTOR_KEYS.all, 'detail'] as const,
  detail: (doctorId: number) => [...DOCTOR_KEYS.details(), doctorId] as const,
}

/**
 * Hook to get all doctors list
 */
export const useGetDoctors = (
  params: PaginationParams & { specialtyId?: number; search?: string },
) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(params),
    queryFn: () => doctorApi.getAllDoctors(params),
    placeholderData: keepPreviousData, // keep previous data while fetching new data
  })
}

/**
 * Hook to get doctor detail by id
 */
export const useGetDoctorDetail = (doctorId?: number) => {
  return useQuery({
    queryKey: DOCTOR_KEYS.detail(doctorId ?? 0),
    queryFn: () => doctorApi.getDoctorDetail(doctorId!),
    enabled: !!doctorId,
  })
}
