import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import { apiClient } from '@/lib/axios'

const DEVICE_BASE = '/devices'

export interface Device {
  deviceId: string
  name: string
  status: 'active' | 'inactive' | 'maintenance'
  assignedTo?: number
  createdAt: string
  updatedAt: string
}

export const deviceApi = {
  /**
   * Get all devices with pagination
   */
  getAllDevices: async (params: PaginationParams & { status?: string }) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<Device>>(
      `${DEVICE_BASE}`,
      { params },
    )
    return data
  },
}
