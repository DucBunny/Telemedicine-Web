import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaginationParams } from '@/types/api.type'
import { patientApi } from '@/features/patient/api/patient.api'
import { getErrorMessage } from '@/lib/axios'

const PATIENT_KEYS = {
  all: ['patients'] as const,

  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params: PaginationParams & { search?: string }) =>
    [...PATIENT_KEYS.lists(), params] as const,

  details: () => [...PATIENT_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...PATIENT_KEYS.details(), id] as const,

  profile: () => [...PATIENT_KEYS.all, 'profile'] as const,

  devices: () => [...PATIENT_KEYS.all, 'devices'] as const,
  patientDevices: (id: number) => [...PATIENT_KEYS.all, 'devices', id] as const,
}

/**
 * Hook to get current patient profile
 */
export const useGetPatientProfile = () => {
  return useQuery({
    queryKey: PATIENT_KEYS.profile(),
    queryFn: () => patientApi.getProfile(),
  })
}

/**
 * Hook to update current patient profile
 */
export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patientApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.profile() })
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
    mutationFn: patientApi.changePassword,
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
