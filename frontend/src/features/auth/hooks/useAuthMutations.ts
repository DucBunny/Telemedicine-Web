import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '@/features/auth/types/auth.dto'

import { authApi } from '@/features/auth/api/auth.api'
import { roleToPath } from '@/features/auth/config'
import { PROFILE_KEYS } from '@/features/profile/hooks/useProfileQueries'
import { getErrorMessage } from '@/lib/axios'
import { Route as LoginRoute } from '@/routes/(auth)/login'
import { useAuthStore } from '@/stores/auth.store'

export const useLoginMutation = () => {
  const navigate = useNavigate()
  const { redirect } = LoginRoute.useSearch()

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),
    onSuccess: (data: LoginResponseDto) => {
      useAuthStore
        .getState()
        .setAuth(data.accessToken, data.user, data.isProfileComplete)

      // Check if profile is incomplete for patient
      if (data.user.role === 'patient' && !data.isProfileComplete) {
        navigate({ to: '/patient/complete-profile', replace: true })
        toast.info('Vui lòng hoàn thiện hồ sơ để tiếp tục')
        return
      }

      const nextPath = redirect ?? roleToPath[data.user.role]
      navigate({ to: nextPath, replace: true })
      toast.success('Đăng nhập thành công!', {
        id: 'login',
      })
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Đăng nhập thất bại')
      console.error('Login failed:', errorMessage)
    },
    retry: false,
  })
}

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: (payload: RegisterRequestDto) => authApi.register(payload),
    onSuccess: () => {
      navigate({ to: '/login' })
      toast.success('Đăng ký thành công!', {
        id: 'register',
      })
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage || 'Đăng ký thất bại')
      console.error('Register failed:', errorMessage)
    },
    retry: false,
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      useAuthStore.getState().clearAuth()
      queryClient.removeQueries({ queryKey: PROFILE_KEYS.all })
      navigate({ to: '/' })
      toast.success('Đăng xuất thành công!', {
        id: 'logout',
      })
    },
    onError: (error) => {
      navigate({ to: '/' })
      console.error('Logout failed:', getErrorMessage(error))
    },
    retry: false,
  })
}
