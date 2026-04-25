import { useQuery } from '@tanstack/react-query'

import { statsApi } from '@/features/dashboard/api/stats.api'

/**
 * Hook to get dashboard statistics
 */
export const useGetDashboardStats = <T>() => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => statsApi.getMyStats<T>(),
  })
}
