import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto/auth.dto'
import type { ApiSuccessResponse } from '@/types/api.type'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/lib/axios'

export const useLoginMutation = () => {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload: LoginRequestDto) => {
      const res: ApiSuccessResponse<LoginResponseDto> =
        await authApi.login(payload)
      return res.data
    },
    onSuccess: (data) => {
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
    mutationFn: async (payload: RegisterRequestDto) => {
      const res: ApiSuccessResponse<RegisterResponseDto> =
        await authApi.register(payload)
      return res.data
    },
    onError: (error) => {
      console.error('Register failed:', getErrorMessage(error))
    },
    retry: false,
  })
}
