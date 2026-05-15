export interface Notification {
  id: number
  type: string
  title: string
  message: string
  createdAt: string
}

// ============== CHAT TYPES ==============

export interface ChatUser {
  id: number
  fullName: string
  avatar: string | null
}

export interface ChatMessageContent {
  text?: string
  file_url?: string
  file_name?: string
  call_id?: number
  call_status?: 'missed' | 'rejected' | 'completed'
  call_duration?: number
}

export interface SocketChatMessage {
  id: string
  conversationId: string
  sender: ChatUser
  type: 'text' | 'image' | 'file' | 'system_alert' | 'call'
  content: ChatMessageContent
  status: 'sent' | 'delivered' | 'read'
  createdAt: string
}

export interface ChatTypingEvent {
  userId: number
  conversationId: string
}

export interface ChatReadEvent {
  conversationId: string
  readerId?: number
  messageIds?: Array<string>
  timestamp: number
}

export interface ChatRoomJoinRejectedPayload {
  conversationId?: string
  roomName?: string
  reason: string
}

// ============== CALL TYPES ==============
export interface CallIncomingPayload {
  conversationId: string
  zegoRoomId: string
  callLogId: number
  initiatorUserId: number
  appointmentId?: number
}

export interface CallPeerPayload {
  conversationId: string
  callLogId: number
  fromUserId: number
}
