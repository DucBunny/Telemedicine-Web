import { useQuery } from '@tanstack/react-query'
import { specialtyApi } from '@/features/patient/api/specialty.api'

const SPECIALTY_KEYS = {
  all: ['specialties'] as const,
  list: () => [...SPECIALTY_KEYS.all, 'list'] as const,
  detail: (id: number) => [...SPECIALTY_KEYS.all, 'detail', id] as const,
}

export const useGetSpecialties = () => {
  return useQuery({
    queryKey: SPECIALTY_KEYS.list(),
    queryFn: () => specialtyApi.getAllSpecialties(),
    staleTime: 1000 * 60 * 10, // 10 minutes — specialties don't change often
  })
}

export const useGetSpecialtyDetail = (id?: number) => {
  return useQuery({
    queryKey: SPECIALTY_KEYS.detail(id ?? 0),
    queryFn: () => specialtyApi.getSpecialtyDetail(id ?? 0),
    enabled: !!id,
  })
}
