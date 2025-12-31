export type UserRole = 'admin' | 'doctor' | 'patient'
export type UserStatus = 'active' | 'locked'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatar?: string
  phoneNumber: string
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  phoneNumber: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}
