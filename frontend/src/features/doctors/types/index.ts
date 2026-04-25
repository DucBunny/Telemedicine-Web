import type { User } from '@/features/auth/types/auth.types'

export interface Doctor {
  userId: number
  specialtyId: number
  degree: string
  experienceYears: number
  bio: string
  address: string
  createdAt: string
  updatedAt: string
  user: User
  specialty: Specialty
}

export interface Specialty {
  id: number
  name: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
