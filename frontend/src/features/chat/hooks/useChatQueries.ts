import { useEffect } from 'react'
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { InfiniteData } from '@tanstack/react-query'
import type { ChatMessage } from '@/features/chat/types'
import type {
  GetMyConversationsParams,
  SendMessageBody,
} from '@/features/chat/types/chat.dto'
import type { ApiCursorPaginatedResponse } from '@/types/api.type'

import { chatApi } from '@/features/chat/api/chat.api'
import {
  addChatMessageListener,
  addChatReadListener,
} from '@/stores/chatSocket.store'

export const CHAT_KEYS = {
  all: ['chat'] as const,

  conversations: () => [...CHAT_KEYS.all, 'conversations'] as const,
  conversationsList: (params?: GetMyConversationsParams) =>
    [...CHAT_KEYS.conversations(), params] as const,
  conversationDetail: (conversationId: string) =>
    [...CHAT_KEYS.conversations(), 'detail', conversationId] as const,

  messages: () => [...CHAT_KEYS.all, 'messages'] as const,
  messagesListByConversation: (conversationId: string) =>
    [...CHAT_KEYS.messages(), 'conversation', conversationId] as const,
}

/**
 * Hook to get all conversations with infinite scroll (cursor-based)
 */
export const useGetMyConversations = (params: GetMyConversationsParams) => {
  return useInfiniteQuery({
    queryKey: CHAT_KEYS.conversationsList(params),
    queryFn: ({ pageParam }) =>
      chatApi.getMyConversations({
        nextCursor: pageParam,
        ...params,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to get messages by conversationId with infinite scroll (cursor-based)
 * Messages load từ mới nhất -> cũ nhất khi scroll lên
 */
export const useGetMessagesByConversationId = ({
  conversationId,
  limit = 15,
}: {
  conversationId: string
  limit?: number
}) => {
  return useInfiniteQuery({
    queryKey: CHAT_KEYS.messagesListByConversation(conversationId),
    queryFn: ({ pageParam }) =>
      chatApi.getMessagesByConversationId(conversationId, {
        nextCursor: pageParam,
        limit,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
    enabled: !!conversationId,
  })
}

/**
 * Hook to get conversation detail
 */
export const useGetConversationDetail = (conversationId: string) => {
  return useQuery({
    queryKey: CHAT_KEYS.conversationDetail(conversationId),
    queryFn: () => chatApi.getConversationDetail(conversationId),
    enabled: !!conversationId,
  })
}

/**
 * Hook to send a message with optimistic update
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessageBody) => chatApi.sendMessage(payload),
    onSuccess: (_, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: CHAT_KEYS.messagesListByConversation(
          variables.conversationId,
        ),
      })
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
    },
  })
}

/**
 * Hook to add a new message from socket to the query cache
 */
export const useAddMessageToCache = () => {
  const queryClient = useQueryClient()

  const addMessage = (conversationId: string, message: ChatMessage) => {
    queryClient.setQueryData<
      InfiniteData<ApiCursorPaginatedResponse<ChatMessage>, string | undefined>
    >(CHAT_KEYS.messagesListByConversation(conversationId), (oldData) => {
      if (!oldData) return oldData

      const hasMessage = oldData.pages.some((page) =>
        page.data.some((item) => item.id === message.id),
      )
      if (hasMessage) return oldData

      const [firstPage, ...restPages] = oldData.pages

      return {
        ...oldData,
        pages: [
          {
            ...firstPage,
            data: [...firstPage.data, message],
          },
          ...restPages,
        ],
      }
    })

    // Also invalidate conversations to update lastMessage
    queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
  }

  return { addMessage }
}

/**
 * Hook to mark all messages from a user as read
 */
export const useMarkAllMessagesAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatApi.markAllAsRead(conversationId),
    retry: 0,
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_KEYS.messagesListByConversation(conversationId),
      })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
    },
  })
}

/**
 * Hook to listen for realtime updates that affect chat lists
 */
export const useRealtimeChatList = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribeMessage = addChatMessageListener(() => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
    })

    const unsubscribeRead = addChatReadListener(() => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
    })

    return () => {
      unsubscribeMessage()
      unsubscribeRead()
    }
  }, [queryClient])
}
