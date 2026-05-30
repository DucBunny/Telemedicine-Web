import type { User } from '@/features/auth/types/auth.types'

export type NotificationType = 'alert' | 'appointment' | 'message' | 'system'

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content: string
  referenceId?: number
  senderId?: number
  isRead: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
  sender?: User
}
