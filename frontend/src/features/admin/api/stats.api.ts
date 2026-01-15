import type { ApiSuccessResponse } from '@/types/api.type'
import { apiClient } from '@/lib/axios'

export interface SystemStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalDevices: number
  devicesOnline: number
  devicesMaintenance: number
}

export const statsApi = {
  /**
   * Get system statistics
   */
  getSystemStats: async () => {
    const { data } =
      await apiClient.get<ApiSuccessResponse<SystemStats>>('/stats/admin')

    return data.data
  },
}
