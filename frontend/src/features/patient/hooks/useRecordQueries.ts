import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recordApi } from '../api/record.api'
import type { PaginationParams } from '@/types/api.type'

const RECORD_KEYS = {
  all: ['records'] as const,
  lists: () => [...RECORD_KEYS.all, 'list'] as const,
  list: (params: PaginationParams) => [...RECORD_KEYS.lists(), params] as const,
  details: () => [...RECORD_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...RECORD_KEYS.details(), id] as const,
  myProfile: () => [...RECORD_KEYS.all, 'my-profile'] as const,
}

/**
 * Hook to get patient's records
 */
export const useGetPatientRecords = (params: PaginationParams) => {
  return useQuery({
    queryKey: RECORD_KEYS.list(params),
    queryFn: () => recordApi.getPatientRecords(params),
  })
}
