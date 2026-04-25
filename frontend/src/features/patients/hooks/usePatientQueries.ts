import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { GetMyPatientsParams } from '@/features/patients/types/patient.dto'

import { patientApi } from '@/features/patients/api/patient.api'

const PATIENT_KEYS = {
  all: ['patients'] as const,

  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: GetMyPatientsParams) =>
    [...PATIENT_KEYS.lists(), params] as const,
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
