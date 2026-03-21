import type { AuthUser } from '@/features/auth/types/auth.types'

export interface LoginRequestDto {
  username: string
  password: string
  deviceInfo?: string
}

export interface RegisterRequestDto {
  fullName: string
  email: string
  phoneNumber: string
  password: string
}

export interface LoginResponseDto {
  accessToken: string
  user: AuthUser
  isProfileComplete: boolean
}

export interface RefreshTokenResponseDto {
  accessToken: string
  user: AuthUser
  isProfileComplete: boolean
}

export interface RegisterResponseDto {
  user: AuthUser
}
