import type { ApiSuccessResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

export const statsApi = {
  /**
   * Get my dashboard statistics (doctor or admin)
   */
  getMyStats: async <T>() => {
    const { data } = await apiClient.get<ApiSuccessResponse<T>>('/me/stats')
    return data.data
  },
}
