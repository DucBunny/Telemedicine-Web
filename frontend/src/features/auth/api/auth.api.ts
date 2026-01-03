import type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto/auth.dto'
import type {
  ApiSuccessOnlyResponse,
  ApiSuccessResponse,
} from '@/types/api.type'
import { apiClient } from '@/lib/axios'

const AUTH_BASE = '/auth'

export const authApi = {
  login: async (payload: LoginRequestDto) => {
    const { data } = await apiClient.post<ApiSuccessResponse<LoginResponseDto>>(
      `${AUTH_BASE}/login`,
      payload,
    )

    return data.data
  },

  register: async (payload: RegisterRequestDto) => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<RegisterResponseDto>
    >(`${AUTH_BASE}/register`, payload)

    return data.data
  },

  refreshToken: async () => {
    const { data } = await apiClient.post<
      ApiSuccessResponse<RefreshTokenResponseDto>
    >(`${AUTH_BASE}/refresh-token`, {}, { withCredentials: true })

    return data.data
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiSuccessOnlyResponse>(
      `${AUTH_BASE}/logout`,
      {},
      { withCredentials: true },
    )

    return data
  },
}
