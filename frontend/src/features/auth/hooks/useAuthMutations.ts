import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../api/auth.api'
import { roleToPath } from '../config'
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '../dto/auth.dto'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/lib/axios'
import { Route as LoginRoute } from '@/routes/(public)/login'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const { redirect } = LoginRoute.useSearch()

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),
    onSuccess: (data: LoginResponseDto) => {
      setAuth(data.accessToken, data.user)
      const nextPath = redirect ?? roleToPath[data.user.role]
      navigate({ to: nextPath })
    },
    onError: (error) => {
      console.error('Login failed:', getErrorMessage(error))
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
    },
    onError: (error) => {
      console.error('Register failed:', getErrorMessage(error))
    },
    retry: false,
  })
}

export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth()
      navigate({ to: '/' })
    },
    onError: (error) => {
      navigate({ to: '/' })
      console.error('Logout failed:', getErrorMessage(error))
    },
    retry: false,
  })
}
