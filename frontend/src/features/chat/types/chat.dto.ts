import type { PaginationParams } from '@/types/api.type'

export interface GetMyConversationsParams extends PaginationParams {
  search?: string
}

export interface SendMessageBody {
  conversationId: string
  message?: string
  type?: 'text' | 'image' | 'file'
  fileUrl?: string
  fileName?: string
}
