import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useQueryClient } from '@tanstack/react-query'
import { isSameDay } from 'date-fns'
import { toast } from 'sonner'

import type { Appointment } from '@/features/appointments/types'
import type { ChatMessage, MessageType } from '@/features/chat/types'
import type { SocketChatMessage } from '@/sockets/socket.types'

import { appointmentMatchesChatPeer } from '@/features/appointments/utils/appointment-video-call-peer'
import { callApi } from '@/features/calls/api/call.api'
import { TelehealthVideoCallDialog } from '@/features/calls/components/TelehealthVideoCallDialog'
import {
  ChatHeader,
  ChatInput,
  DateDivider,
  MessageBubble,
  TypingIndicator,
} from '@/features/chat/components/common'
import {
  CHAT_KEYS,
  useAddMessageToCache,
  useGetConversationDetail,
  useGetMessagesByConversationId,
  useSendMessage,
} from '@/features/chat/hooks/useChatQueries'
import { uploadApi } from '@/features/uploads/api/upload.api'
import Loader, { LoaderItem } from '@/components/common/Loader'
import { selectUser, useAuthStore } from '@/stores/auth.store'
import {
  addChatMessageListener,
  addChatReadListener,
  addChatRoomJoinRejectedListener,
  addChatTypingStartListener,
  addChatTypingStopListener,
  useChatSocketStore,
} from '@/stores/chatSocket.store'
import {
  addCallPeerEndedListener,
  addCallPeerRejectedListener,
  useSystemSocketStore,
} from '@/stores/systemSocket.store'
import { useTelehealthCallStore } from '@/stores/telehealthCall.store'

interface MessageGroup {
  date: Date
  messages: Array<ChatMessage>
}

interface ChatRoomBaseProps {
  conversationId: string
  onBack: () => void
  /** `?startVideo=true` sau khi bấm gọi từ lịch (bác sĩ / bệnh nhân) */
  autoStartVideoFromAppointment?: boolean
  onAutoStartVideoSearchConsumed?: () => void
}

export const ChatRoomBase = ({
  conversationId,
  onBack,
  autoStartVideoFromAppointment = false,
  onAutoStartVideoSearchConsumed,
}: ChatRoomBaseProps) => {
  const currentUser = useAuthStore(selectUser)

  const [inputValue, setInputValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<{
    file: File
    type: 'image' | 'file'
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [videoCallOpen, setVideoCallOpen] = useState(false)
  const [zegoMountVersion, setZegoMountVersion] = useState(0)
  const [outgoingCallLogId, setOutgoingCallLogId] = useState<number | null>(
    null,
  )

  const activeVisitAppointment = useTelehealthCallStore(
    (s) => s.activeVisitAppointment,
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const previousScrollHeightRef = useRef(0)
  const videoCallOpenRef = useRef(false)
  const skipTelehealthEndEmitRef = useRef(false)
  const callEndSentRef = useRef(false)
  const activeCallLogIdRef = useRef<number | null>(null)
  const autoStartConsumedRef = useRef(false)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
  const queryClient = useQueryClient()
  const {
    emitJoinConversation: joinConversation,
    emitLeaveConversation: leaveConversation,
    emitTypingStart: sendTypingStart,
    emitTypingStop: sendTypingStop,
    emitReadEvent: sendReadEvent,
  } = useChatSocketStore()

  const allMessages = messagesData?.pages.flatMap((page) => page.data) || []
  const otherParticipant = conversationDetail?.user

  useEffect(() => {
    activeCallLogIdRef.current = outgoingCallLogId
  }, [outgoingCallLogId])

  useEffect(() => {
    videoCallOpenRef.current = videoCallOpen
  }, [videoCallOpen])

  const markSkipNextTelehealthEndEmit = () => {
    skipTelehealthEndEmitRef.current = true
    queueMicrotask(() => {
      skipTelehealthEndEmitRef.current = false
    })
  }

  const handleCallSessionFinalize = (durationSeconds: number) => {
    if (skipTelehealthEndEmitRef.current) return
    if (callEndSentRef.current) return
    const id = activeCallLogIdRef.current
    if (id == null) return
    callEndSentRef.current = true
    useSystemSocketStore
      .getState()
      .emitCallEnd(conversationId, id, durationSeconds)
  }

  const handleVideoOpenChange = (open: boolean) => {
    if (!open) {
      if (!skipTelehealthEndEmitRef.current && !callEndSentRef.current) {
        const id = activeCallLogIdRef.current
        if (id != null) {
          callEndSentRef.current = true
          useSystemSocketStore.getState().emitCallEnd(conversationId, id, 0)
        }
      }
      videoCallOpenRef.current = false
      setVideoCallOpen(false)
      setOutgoingCallLogId(null)
      useTelehealthCallStore.getState().setActiveVisitAppointment(null)
    } else {
      videoCallOpenRef.current = true
      setVideoCallOpen(true)
    }
  }

  const startOutgoingVideoCall = useCallback(
    async (opts?: { visitAppointment?: Appointment | null }) => {
      callEndSentRef.current = false
      useTelehealthCallStore
        .getState()
        .setActiveVisitAppointment(opts?.visitAppointment ?? null)
      try {
        const { callLogId } = await callApi.startVideoCall(conversationId)
        activeCallLogIdRef.current = callLogId
        setOutgoingCallLogId(callLogId)
        setZegoMountVersion((v) => v + 1)
        videoCallOpenRef.current = true
        useSystemSocketStore
          .getState()
          .emitCallInvite(
            conversationId,
            callLogId,
            opts?.visitAppointment?.id,
          )
        setVideoCallOpen(true)
      } catch (e) {
        console.error('[Chat] startVideoCall', e)
        useTelehealthCallStore.getState().setActiveVisitAppointment(null)
        toast.error('Không thể bắt đầu cuộc gọi. Thử lại sau.')
      }
    },
    [conversationId],
  )

  useEffect(() => {
    autoStartConsumedRef.current = false
  }, [conversationId, autoStartVideoFromAppointment])

  useEffect(() => {
    if (!autoStartVideoFromAppointment) return
    if (autoStartConsumedRef.current) return
    if (!otherParticipant?.id) return

    const appt = useTelehealthCallStore.getState().pendingAppointmentForCall

    const consumeSearch = () => {
      autoStartConsumedRef.current = true
      onAutoStartVideoSearchConsumed?.()
    }

    if (!appt) {
      consumeSearch()
      return
    }

    const role = currentUser?.role
    if (role !== 'doctor' && role !== 'patient') {
      consumeSearch()
      return
    }

    if (!appointmentMatchesChatPeer(appt, otherParticipant.id, role)) {
      toast.error('Lịch hẹn không khớp cuộc trò chuyện này.')
      useTelehealthCallStore.getState().setPendingAppointmentForCall(null)
      consumeSearch()
      return
    }

    autoStartConsumedRef.current = true
    useTelehealthCallStore.getState().setPendingAppointmentForCall(null)
    consumeSearch()
    void startOutgoingVideoCall({ visitAppointment: appt })
  }, [
    autoStartVideoFromAppointment,
    otherParticipant?.id,
    conversationId,
    onAutoStartVideoSearchConsumed,
    startOutgoingVideoCall,
    currentUser?.role,
  ])

  useEffect(() => {
    const unsubReject = addChatRoomJoinRejectedListener((p) => {
      if (p.reason !== 'NOT_PARTICIPANT') return
      if (p.conversationId && p.conversationId !== conversationId) return
      toast.error('Bạn không có quyền vào cuộc trò chuyện này.')
      onBack()
    })
    const unsubDeclined = addCallPeerRejectedListener((p) => {
      if (p.conversationId !== conversationId) return
      if (!videoCallOpenRef.current) return
      markSkipNextTelehealthEndEmit()
      videoCallOpenRef.current = false
      setVideoCallOpen(false)
      setOutgoingCallLogId(null)
      useTelehealthCallStore.getState().setActiveVisitAppointment(null)
      toast.message('Đối phương đã từ chối cuộc gọi.')
    })
    const unsubEnded = addCallPeerEndedListener((p) => {
      if (p.conversationId !== conversationId) return
      if (!videoCallOpenRef.current) return
      markSkipNextTelehealthEndEmit()
      videoCallOpenRef.current = false
      setVideoCallOpen(false)
      setOutgoingCallLogId(null)
      useTelehealthCallStore.getState().setActiveVisitAppointment(null)
      toast.message('Cuộc gọi đã kết thúc.')
    })
    return () => {
      unsubReject()
      unsubDeclined()
      unsubEnded()
    }
  }, [conversationId, onBack, currentUser?.id])

  // Khi vào conversation: join room + gửi read event ngay lập tức
  useEffect(() => {
    if (!conversationId) return
    joinConversation(conversationId)
    setIsTyping(false)
    setShouldScrollToBottom(true)
    sendReadEvent(conversationId)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    return () => leaveConversation(conversationId)
  }, [conversationId, joinConversation, leaveConversation, sendReadEvent])

  useEffect(() => {
    const unsubscribeMessage = addChatMessageListener(
      (message: SocketChatMessage) => {
        if (message.conversationId !== conversationId) return

        const normalizedMessage: ChatMessage = {
          id: message.id,
          sender: {
            id: message.sender.id,
            fullName: message.sender.fullName,
            avatar: message.sender.avatar ?? undefined,
          },
          type: message.type as ChatMessage['type'],
          content: message.content,
          status: message.status === 'read' ? 'read' : 'sent',
          createdAt: message.createdAt,
        }
        addMessage(conversationId, normalizedMessage)
        setShouldScrollToBottom(true)

        // Nếu là tin nhắn từ người khác → gửi read event ngay qua socket
        // Backend handler sẽ cập nhật DB + relay cho người kia
        if (message.sender.id !== currentUser?.id) {
          sendReadEvent(conversationId)
        }
      },
    )

    const unsubscribeRead = addChatReadListener((payload) => {
      if (payload.conversationId !== conversationId) return
      queryClient.invalidateQueries({
        queryKey: CHAT_KEYS.messagesListByConversation(conversationId),
      })
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations() })
    })

    const unsubscribeTypingStart = addChatTypingStartListener(
      ({ userId, conversationId: typingConversationId }) => {
        if (typingConversationId !== conversationId) return
        if (userId === currentUser?.id) return
        setIsTyping(true)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false)
          typingTimeoutRef.current = null
        }, 3000)
      },
    )

    const unsubscribeTypingStop = addChatTypingStopListener(
      ({ userId, conversationId: typingConversationId }) => {
        if (typingConversationId !== conversationId) return
        if (userId === currentUser?.id) return
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = null
        }
        setIsTyping(false)
      },
    )

    return () => {
      unsubscribeMessage()
      unsubscribeRead()
      unsubscribeTypingStart()
      unsubscribeTypingStop()
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [addMessage, conversationId, currentUser?.id, queryClient, sendReadEvent])

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

    // stopTyping()
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
      sendTypingStop(conversationId)
      setShouldScrollToBottom(true)
    } catch (error) {
      console.error('[Chat] Send Message Error:', error)
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (!conversationId) return
    if (value.trim()) {
      sendTypingStart(conversationId)
    } else {
      sendTypingStop(conversationId)
    }
  }

  // Auto scroll to latest message
  useEffect(() => {
    if (shouldScrollToBottom || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [allMessages.length, isTyping, shouldScrollToBottom])

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
      <TelehealthVideoCallDialog
        open={videoCallOpen}
        onOpenChange={handleVideoOpenChange}
        conversationId={conversationId}
        peerUser={otherParticipant}
        zegoCallLogId={outgoingCallLogId ?? undefined}
        zegoMountVersion={zegoMountVersion}
        onCallSessionFinalize={handleCallSessionFinalize}
        visitContextAppointment={activeVisitAppointment}
      />
      {/* Header */}
      <div className="z-10 shrink-0 bg-white">
        <ChatHeader
          otherParticipant={otherParticipant}
          onBack={onBack}
          onVideoCall={
            videoCallOpen ? undefined : () => startOutgoingVideoCall()
          }
        />
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
