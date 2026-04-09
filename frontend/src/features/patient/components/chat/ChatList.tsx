import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SquarePen } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useDebounceValue } from 'usehooks-ts'
import {
  ChatItem,
  EmptyChatList,
  RecentDoctorsList,
} from '@/features/patient/components/chat'
import { MainPageHeader, SearchBar } from '@/features/patient/components/common'
import { Button } from '@/components/ui/button'
import { useGetMyConversations } from '@/features/patient/hooks/useChatQueries'
import Loader from '@/components/Loader'

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
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMyConversations({ limit: 10, search: debouncedSearch })

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
      to: '/patient/chat/$conversationId',
      params: { conversationId },
    })
  }

  // Flatten all pages and deduplicate by user ID
  const conversations = conversationsData?.pages.flatMap((p) => p.data) || []

  // Recent doctors from first 10 conversations
  const recentDoctors = conversations.slice(0, 10)

  if (isLoading) return <Loader />

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Không thể tải danh sách trò chuyện</p>
      </div>
    )
  }

  return (
    <>
      <div className="px-4">
        {/* Header */}
        <MainPageHeader
          title="Trò chuyện"
          rightAction={
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full active:scale-95">
              <SquarePen className="size-5" strokeWidth="2.5" />
            </Button>
          }
        />

        {/* Search Bar */}
        <SearchBar
          placeholder="Tìm kiếm bác sĩ..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="mt-3 space-y-3 md:mt-6 md:space-y-6">
        {debouncedSearch || conversations.length > 0 ? (
          <>
            {/* Recent Doctors */}
            {!search && recentDoctors.length > 0 && (
              <RecentDoctorsList
                conversations={recentDoctors}
                onClick={handleOpenChat}
              />
            )}

            {/* Conversation List */}
            <div className="px-4 pb-2">
              {!search || conversations.length > 0 ? (
                <>
                  {conversations.map((conv) => (
                    <ChatItem
                      key={conv.id}
                      conversation={conv}
                      onClick={handleOpenChat}
                      isActive={activeChatId === conv.id}
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
                  Không tìm thấy kết quả nào cho "{search}"
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyChatList
            onBookAction={() => navigate({ to: '/patient/appointments' })}
          />
        )}
      </div>
    </>
  )
}
