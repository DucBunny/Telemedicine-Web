import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '../dto/auth.dto'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/lib/axios'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginRequestDto) => authApi.login(payload),
    onSuccess: (data: LoginResponseDto) => {
      setAuth(data.accessToken, data.user)
    },
    onError: (error) => {
      console.error('Login failed:', getErrorMessage(error))
    },
    retry: false,
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: (payload: RegisterRequestDto) => authApi.register(payload),
    onError: (error) => {
      console.error('Register failed:', getErrorMessage(error))
    },
    retry: false,
  })
}
