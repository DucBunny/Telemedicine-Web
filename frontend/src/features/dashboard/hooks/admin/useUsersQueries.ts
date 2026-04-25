import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/user.api'
import type { PaginationParams } from '@/types/api.type'

const ADMIN_KEYS = {
  all: ['admin'] as const,
  users: () => [...ADMIN_KEYS.all, 'users'] as const,
  usersList: (params: PaginationParams & { search?: string; role?: string }) =>
    [...ADMIN_KEYS.users(), 'list', params] as const,
  userDetail: (id: number) => [...ADMIN_KEYS.users(), 'detail', id] as const,
  recentUsers: (limit: number) =>
    [...ADMIN_KEYS.users(), 'recent', limit] as const,
}

/**
 * Hook to get all users with pagination
 */
export const useGetAllUsers = (
  params: PaginationParams & { search?: string; role?: string },
) => {
  return useQuery({
    queryKey: ADMIN_KEYS.usersList(params),
    queryFn: () => adminApi.getAllUsers(params),
  })
}

/**
 * Hook to get recent users
 */
export const useGetRecentUsers = (limit = 5) => {
  return useQuery({
    queryKey: ADMIN_KEYS.recentUsers(limit),
    queryFn: () => adminApi.getRecentUsers(limit),
  })
}

/**
 * Hook to get user by ID
 */
export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ADMIN_KEYS.userDetail(id),
    queryFn: () => adminApi.getUserById(id),
    enabled: !!id,
  })
}

/**
 * Hook to update user status
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() })
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.userDetail(variables.id),
      })
    },
  })
}

/**
 * Hook to delete user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() })
    },
  })
}
