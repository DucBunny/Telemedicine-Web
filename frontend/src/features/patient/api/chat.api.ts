import type {
  ApiCursorPaginatedResponse,
  ApiSuccessResponse,
  PaginationParams,
} from '@/types/api.type'
import type { ChatConversation, ChatMessage } from '@/features/patient/types'
import type {
  GetMyConversationsParams,
  SendMessageBody,
} from '@/features/patient/dto/chat.dto'
import { apiClient } from '@/lib/axios'

const CHAT_BASE = '/chat'

export const chatApi = {
  /**
   * Get all conversations for logged in user (cursor-based)
   */
  getMyConversations: async (params?: GetMyConversationsParams) => {
    const { data } = await apiClient.get<
      ApiCursorPaginatedResponse<ChatConversation>
    >(`${CHAT_BASE}/conversations`, { params })
    return data
  },

  /**
   * Get messages by conversationId (cursor-based)
   */
  getMessagesByConversationId: async (
    conversationId: string,
    params?: PaginationParams,
  ) => {
    const { data } = await apiClient.get<
      ApiCursorPaginatedResponse<ChatMessage>
    >(`${CHAT_BASE}/conversations/${conversationId}/messages`, { params })
    return data
  },

  /**
   * Send a message
   */
  sendMessage: async (payload: SendMessageBody) => {
    const { data } = await apiClient.post<ApiSuccessResponse<ChatMessage>>(
      `${CHAT_BASE}/messages`,
      payload,
    )
    return data.data
  },

  /**
   * Mark all messages from a user as read
   */
  markAllAsRead: async (conversationId: string) => {
    const { data } = await apiClient.put<
      ApiSuccessResponse<{ success: boolean }>
    >(`${CHAT_BASE}/conversations/${conversationId}/read-all`)
    return data.data
  },

  /**
   * Get messages with a specific user (cursor-based) - legacy by userId
   */
  getMessagesByUserIds: async (userId: number, params?: PaginationParams) => {
    const { data } = await apiClient.get<
      ApiCursorPaginatedResponse<ChatMessage>
    >(`${CHAT_BASE}/users/${userId}/messages`, { params })
    return data
  },
}
