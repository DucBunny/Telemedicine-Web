import { useQuery } from '@tanstack/react-query'
import { specialtyApi } from '../api/specialty.api'

const SPECIALTY_KEYS = {
  all: ['specialties'] as const,
  list: () => [...SPECIALTY_KEYS.all, 'list'] as const,
}

export const useGetSpecialties = () => {
  return useQuery({
    queryKey: SPECIALTY_KEYS.list(),
    queryFn: () => specialtyApi.getAllSpecialties(),
    staleTime: 1000 * 60 * 10, // 10 minutes — specialties don't change often
  })
}
