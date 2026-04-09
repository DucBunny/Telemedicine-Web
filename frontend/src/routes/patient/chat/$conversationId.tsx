import { createFileRoute } from '@tanstack/react-router'
import type { InfiniteData } from '@tanstack/react-query'
import type { ChatConversation } from '@/features/patient/types'
import type { ApiCursorPaginatedResponse } from '@/types/api.type'
import { chatApi } from '@/features/patient/api/chat.api'
import { CHAT_KEYS } from '@/features/patient/hooks/useChatQueries'
import { ChatPage } from '@/features/patient/pages/ChatPage'

export const Route = createFileRoute('/patient/chat/$conversationId')({
  loader: async ({ params, context }) => {
    if (!params.conversationId) return

    try {
      await chatApi.markAllAsRead(params.conversationId)

      // Update unread count in all cached conversation lists without forcing refetch.
      context.queryClient.setQueriesData<
        InfiniteData<
          ApiCursorPaginatedResponse<ChatConversation>,
          string | undefined
        >
      >({ queryKey: CHAT_KEYS.conversations() }, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((conversation) =>
              conversation.id === params.conversationId
                ? { ...conversation, unreadCount: 0 }
                : conversation,
            ),
          })),
        }
      })
    } catch {
      // Do not block navigation if marking read fails.
    }
  },
  component: ChatPage,
  staticData: {
    hideMobileNav: true,
  },
})
