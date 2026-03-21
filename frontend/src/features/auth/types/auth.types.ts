export type UserRole = 'admin' | 'doctor' | 'patient'
export type UserStatus = 'active' | 'locked' | 'pending'

// User info returned by auth endpoints (sanitized)
export interface AuthUser {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
  avatar?: string
  lastLoginAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}
