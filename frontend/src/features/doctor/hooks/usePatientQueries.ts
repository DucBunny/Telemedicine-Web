import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patientApi } from '../api/patient.api'
import type { PaginationParams } from '@/types/api.type'

const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { search?: string }) =>
    [...PATIENT_KEYS.lists(), params] as const,
}

/**
 * Hook to get all patients with pagination
 */
export const useGetPatients = (
  params: PaginationParams & { search?: string },
) => {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params),
    queryFn: () => patientApi.getAll(params),
  })
}
