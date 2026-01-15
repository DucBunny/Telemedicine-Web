import { useQuery } from '@tanstack/react-query'
import { statsApi } from '../api/stats.api'

/**
 * Hook to get system statistics
 */
export const useGetSystemStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => statsApi.getSystemStats(),
  })
}
