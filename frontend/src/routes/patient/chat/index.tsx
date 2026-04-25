import { createFileRoute } from '@tanstack/react-router'

import { chatApi } from '@/features/chat/api/chat.api'
import { CHAT_KEYS } from '@/features/chat/hooks/useChatQueries'
import { ChatPage } from '@/pages/patient/ChatPage'

export const Route = createFileRoute('/patient/chat/')({
  component: ChatPage,
  loader: async ({ context }) => {
    // Prefetch first page of conversations (cursor-based)
    await context.queryClient.ensureQueryData({
      queryKey: [...CHAT_KEYS.conversations(), 'infinite'],
      queryFn: () => chatApi.getMyConversations({ limit: 20 }),
    })
  },
})
