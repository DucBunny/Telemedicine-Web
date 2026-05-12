import type { ApiSuccessResponse } from '@/types/api.type'

import { apiClient } from '@/lib/axios'

export const userApi = {
  getMyRelatedUsersPresence: async () => {
    const { data } =
      await apiClient.get<ApiSuccessResponse<Record<number, boolean>>>(
        `/me/presence`,
      )
    return data.data
  },
}
