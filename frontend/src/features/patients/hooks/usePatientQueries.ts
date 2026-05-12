import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { GetMyPatientsParams } from '@/features/patients/types/patient.dto'

import { patientApi } from '@/features/patients/api/patient.api'

const PATIENT_KEYS = {
  all: ['patients'] as const,

  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: GetMyPatientsParams) =>
    [...PATIENT_KEYS.lists(), params] as const,

  details: () => [...PATIENT_KEYS.all, 'detail'] as const,
  detail: (patientId: number) =>
    [...PATIENT_KEYS.details(), patientId] as const,
}

/**
 * Hook to get all patients for logged in user (offset-limit based)
 */
export const useGetMyPatients = (params: GetMyPatientsParams) => {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params),
    queryFn: () => patientApi.getMyPatients(params),
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to get patient detail by id
 */
export const useGetPatientDetail = (patientId: number) => {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(patientId),
    queryFn: () => patientApi.getPatientDetail(patientId),
    enabled: !!patientId,
  })
}
