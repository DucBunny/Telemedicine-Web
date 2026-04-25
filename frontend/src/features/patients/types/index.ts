import type { User } from '@/features/auth/types/auth.types'

export type GenderOption = 'male' | 'female' | 'other'

export type BloodTypeOption =
  | 'A+'
  | 'B+'
  | 'AB+'
  | 'O+'
  | 'A-'
  | 'B-'
  | 'AB-'
  | 'O-'
  | 'unknown'

export interface Patient {
  userId: number
  dateOfBirth: string
  gender: GenderOption
  bloodType: BloodTypeOption
  height: number
  weight: number
  medicalHistory: string
  address: string
  currentHealthStatus: string
  currentIssue: string | null
  lastAlertAt: string | null
  createdAt: string
  updatedAt: string
  user: User
}
