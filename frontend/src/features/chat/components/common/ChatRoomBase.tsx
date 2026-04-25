import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { isSameDay } from 'date-fns'
import { toast } from 'sonner'

import type { ChatMessage, MessageType } from '@/features/chat/types'
import type { SocketChatMessage } from '@/lib/socket.types'

import {
  ChatHeader,
  ChatInput,
  DateDivider,
  MessageBubble,
  TypingIndicator,
} from '@/features/chat/components/common'
import {
  useAddMessageToCache,
  useGetConversationDetail,
  useGetMessagesByConversationId,
  useSendMessage,
} from '@/features/chat/hooks/useChatQueries'
import { uploadApi } from '@/features/uploads/api/upload.api'
import Loader, { LoaderItem } from '@/components/common/Loader'
import { useChatSocket } from '@/lib/socket.hooks'
import { useAuthStore } from '@/stores/auth.store'

interface MessageGroup {
  date: Date
  messages: Array<ChatMessage>
}

interface ChatRoomBaseProps {
  conversationId: string
  onBack: () => void
}

export const ChatRoomBase = ({ conversationId, onBack }: ChatRoomBaseProps) => {
  const currentUser = useAuthStore((state) => state.user)

  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<{
    file: File
    type: 'image' | 'file'
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const previousScrollHeightRef = useRef(0)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)

  // Get conversation detail
  const { data: conversationDetail } = useGetConversationDetail(conversationId)

  // Fetch messages with infinite scroll using conversationId
  const {
    data: messagesData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetMessagesByConversationId({ conversationId, limit: 15 })

  const { mutateAsync: sendMessage, isPending: isSendMessagePending } =
    useSendMessage()
  const { addMessage } = useAddMessageToCache()

  const allMessages = messagesData?.pages.flatMap((page) => page.data) || []
  const otherParticipant = conversationDetail?.user

  // Socket for real-time messaging
  const { isTyping, sendTyping, stopTyping } = useChatSocket({
    userId: currentUser?.id || 0,
    otherUserId: otherParticipant?.id || 0,
    onMessage: useCallback(
      (message: SocketChatMessage) => {
        // Add new message to cache if it's from the other user
        if (message.sender.id !== currentUser?.id) {
          const normalizedMessage: ChatMessage = {
            id: message.id,
            sender: {
              id: message.sender.id,
              fullName: message.sender.fullName,
              avatar: message.sender.avatar ?? undefined,
            },
            type: message.type,
            content: message.content,
            status: message.status === 'read' ? 'read' : 'sent',
            createdAt: message.createdAt,
          }
          addMessage(conversationId, normalizedMessage)
          setShouldScrollToBottom(true)
        }
      },
      [conversationId, currentUser?.id, addMessage],
    ),
  })

  // Load more trigger (for older messages when scrolling up)
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 })

  // Load more messages when scrolling up
  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) return

    previousScrollHeightRef.current =
      messagesContainerRef.current?.scrollHeight || 0
    setShouldScrollToBottom(false)
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // Restore scroll position after loading more messages
  useEffect(() => {
    if (isFetchingNextPage || previousScrollHeightRef.current === 0) return

    const container = messagesContainerRef.current
    if (!container) return

    const newScrollHeight = container.scrollHeight
    const diff = newScrollHeight - previousScrollHeightRef.current

    if (diff > 0) {
      container.scrollTop += diff
    }

    previousScrollHeightRef.current = 0
  }, [isFetchingNextPage, allMessages.length])

  // Build oldest -> newest by reversing page order from cursor pagination
  const sortedMessages =
    messagesData?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.data) || []

  // Group messages by date
  const messageGroups = sortedMessages.reduce<Array<MessageGroup>>(
    (groups, message) => {
      const msgDate = new Date(message.createdAt)
      const lastGroup = groups.at(-1)

      if (lastGroup && isSameDay(lastGroup.date, msgDate)) {
        // Add to existing group
        lastGroup.messages.push(message)
      } else {
        // Create new group
        groups.push({
          date: msgDate,
          messages: [message],
        })
      }

      return groups
    },
    [],
  )

  // Handlers for sending messages and file uploads
  const handleFileSelect = (file: File, type: 'image' | 'file') =>
    setSelectedFile({ file, type })

  const handleClearFile = () => setSelectedFile(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return

    stopTyping()
    setIsUploading(true)

    try {
      let fileUrl: string | undefined
      let fileName: string | undefined
      let messageType: MessageType = 'text'

      // Upload file if selected with conversationId in moduleName
      if (selectedFile) {
        const isImageFile = selectedFile.file.type.startsWith('image/')
        const uploadFn = isImageFile
          ? uploadApi.uploadImage
          : uploadApi.uploadDocument

        const result = await uploadFn(selectedFile.file, {
          moduleName: `chats/${conversationId}`,
        })
        fileUrl = result.url
        fileName = selectedFile.file.name
        messageType = isImageFile ? 'image' : 'file'
      }

      // Send message
      await sendMessage({
        conversationId,
        message: inputValue.trim(),
        type: messageType,
        fileUrl,
        fileName,
      })

      // Clear inputs
      setInputValue('')
      setSelectedFile(null)
      setShouldScrollToBottom(true)
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value.trim()) {
      sendTyping()
    } else {
      stopTyping()
    }
  }

  // Auto scroll to latest message
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [allMessages.length, shouldScrollToBottom])

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Không thể tải tin nhắn</p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col md:inset-x-0 lg:static lg:h-full">
      {/* Header */}
      <div className="z-10 shrink-0 bg-white">
        <ChatHeader otherParticipant={otherParticipant} onBack={onBack} />
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="scrollbar-hide flex flex-1 flex-col overflow-y-auto p-4 pb-0 md:ml-20 lg:ml-0 lg:bg-gray-50">
        {/* Load more trigger (at top for loading older messages) */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-2">
            {isFetchingNextPage && <LoaderItem />}
          </div>
        )}

        {/* Render messages grouped by date */}
        {messageGroups.map((group) => (
          <Fragment key={group.date.toISOString()}>
            <DateDivider date={group.date} />
            {group.messages.map((message, index) => {
              const nextMessage = group.messages[index + 1]
              const isLast =
                index === group.messages.length - 1 ||
                nextMessage.sender.id !== message.sender.id
              const isFirst =
                index === 0 ||
                group.messages[index - 1].sender.id !== message.sender.id

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isFirst={isFirst}
                  isLast={isLast}
                />
              )
            })}
          </Fragment>
        ))}

        {/* Typing indicator */}
        {(isUploading || isSendMessagePending || isTyping) && (
          <TypingIndicator otherParticipant={otherParticipant} />
        )}

        <div ref={messagesEndRef} className="h-0.5" />
      </div>

      {/* Input */}
      <div className="z-10 shrink-0 bg-white">
        <ChatInput
          value={inputValue}
          onChange={handleInputChange}
          onSend={handleSendMessage}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onClearFile={handleClearFile}
          isUploading={isUploading || isSendMessagePending}
        />
      </div>
    </div>
  )
}
