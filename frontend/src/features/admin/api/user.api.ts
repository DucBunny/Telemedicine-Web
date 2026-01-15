import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import { apiClient } from '@/lib/axios'

const USER_BASE = '/users'

export interface User {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  role: 'admin' | 'doctor' | 'patient'
  status: 'active' | 'locked'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export const adminApi = {
  /**
   * Get all users with pagination
   */
  getAllUsers: async (
    params: PaginationParams & { search?: string; role?: string },
  ) => {
    const { data } = await apiClient.get<ApiPaginatedResponse<User>>(
      `${USER_BASE}`,
      { params },
    )
    return data
  },

  /**
   * Get recent users
   */
  getRecentUsers: async (limit = 5) => {
    const { data } = await apiClient.get<ApiSuccessResponse<Array<User>>>(
      `${USER_BASE}/recent`,
      { params: { limit } },
    )
    return data.data
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: number) => {
    const { data } = await apiClient.get<ApiSuccessResponse<User>>(
      `${USER_BASE}/${id}`,
    )
    return data.data
  },

  /**
   * Update user status
   */
  updateUserStatus: async (id: number, status: string) => {
    const { data } = await apiClient.put<ApiSuccessResponse<User>>(
      `${USER_BASE}/${id}/status`,
      { status },
    )
    return data.data
  },

  /**
   * Delete user
   */
  deleteUser: async (id: number) => {
    const { data } = await apiClient.delete<
      ApiSuccessResponse<{ message: string }>
    >(`${USER_BASE}/${id}`)
    return data.data
  },
}
