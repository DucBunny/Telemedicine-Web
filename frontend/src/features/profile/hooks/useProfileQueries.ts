import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { profileApi } from '@/features/profile/api/profile.api'
import { getErrorMessage } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth.store'

export const PROFILE_KEYS = {
  all: ['profile'] as const,

  profile: () => [...PROFILE_KEYS.all, 'current'] as const,

  devices: () => [...PROFILE_KEYS.all, 'devices'] as const,
  patientDevices: (id: number) => [...PROFILE_KEYS.all, 'devices', id] as const,
}

/**
 * Hook to get current user logged in profile
 */
export const useGetProfile = <T>() => {
  return useQuery({
    queryKey: PROFILE_KEYS.profile(),
    queryFn: () => profileApi.getProfile<T>(),
  })
}

/**
 * Hook to update current patient profile
 */
export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: profileApi.updatePatientProfile,
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profile() })
      useAuthStore.setState({ user: updatedProfile.user })
      toast.success('Cập nhật thông tin cá nhân thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Cập nhật thông tin cá nhân thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to update current doctor profile
 */
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: profileApi.updateDoctorProfile,
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.profile() })
      useAuthStore.setState({ user: updatedProfile.user })
      toast.success('Cập nhật thông tin cá nhân thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Cập nhật thông tin cá nhân thất bại')
    },
    retry: false,
  })
}

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Đổi mật khẩu thất bại')
    },
    retry: false,
  })
}
