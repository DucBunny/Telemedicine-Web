import { createFileRoute } from '@tanstack/react-router'
import { ChatPage } from '@/features/patient/pages/ChatPage'
import { chatApi } from '@/features/patient/api/chat.api'
import { CHAT_KEYS } from '@/features/patient/hooks/useChatQueries'

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
