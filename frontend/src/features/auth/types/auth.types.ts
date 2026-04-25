export type UserRole = 'admin' | 'doctor' | 'patient'
export type UserStatus = 'active' | 'locked' | 'incomplete'

// User info returned by auth endpoints (sanitized)
export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
  avatar?: string
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
}
