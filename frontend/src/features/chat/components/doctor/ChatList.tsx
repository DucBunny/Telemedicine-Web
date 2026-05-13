import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from '@tanstack/react-router'
import { useDebounceValue } from 'usehooks-ts'

import {
  ChatItem,
  EmptyChatList,
  RecentUsersList,
} from '@/features/chat/components/common'
import {
  useGetMyConversations,
  useRealtimeChatList,
} from '@/features/chat/hooks/useChatQueries'
import Loader from '@/components/common/Loader'
import { SearchBar } from '@/components/common/SearchBar'

interface ChatListProps {
  activeChatId?: string
}

export const ChatList = ({ activeChatId }: ChatListProps = {}) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching

  // Fetch conversations with infinite scroll
  const {
    data: conversationsData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyConversations({ limit: 55, search: debouncedSearch })

  useRealtimeChatList()

  // Infinite scroll trigger
  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  const handleOpenChat = (conversationId: string) => {
    navigate({
      to: '/doctor/chat/$conversationId',
      params: { conversationId },
    })
  }

  // Flatten all pages and deduplicate by user ID
  const conversations = conversationsData?.pages.flatMap((p) => p.data) || []

  // Recent patients from first 10 conversations
  const recentPatients = conversations.slice(0, 10)

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Không thể tải danh sách trò chuyện</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-4">
        <SearchBar
          placeholder="Tìm bệnh nhân..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="mt-3 min-h-0 flex-1 space-y-3 md:mt-6 md:space-y-6 lg:mt-3">
        {debouncedSearch || conversations.length > 0 ? (
          <>
            {/* Recent Patients */}
            {!search && recentPatients.length > 0 && (
              <RecentUsersList
                conversations={recentPatients}
                onClick={handleOpenChat}
              />
            )}

            {/* Conversation List */}
            <div className="px-2 pb-2">
              {!search || conversations.length > 0 ? (
                <>
                  {conversations.map((conversation) => (
                    <ChatItem
                      key={conversation.id}
                      conversation={conversation}
                      onClick={handleOpenChat}
                      isActive={activeChatId === conversation.id}
                    />
                  ))}
                  {/* Load more trigger */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                      {isFetchingNextPage && (
                        <div className="size-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  Không tìm thấy kết quả nào cho &quot;{search}&quot;
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyChatList />
        )}
      </div>
    </div>
  )
}
