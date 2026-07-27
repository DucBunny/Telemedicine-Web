export interface NotificationPayload {
  id: number
  type: string
  title: string
  content: string
  referenceId: string
  senderId?: number
  isRead: boolean
  createdAt: string
}

// ============== CALL TYPES ==============
export interface CallIncomingPayload {
  conversationId: string
  zegoRoomId: string
  callLogId: number
  initiatorUserId: number
  appointmentId?: number
  fromAlert?: boolean
}

export interface CallPeerPayload {
  conversationId: string
  callLogId: number
  fromUserId: number
}

// ============== ALERT TYPES ==============
export interface AlertFlashPayload {
  alertId: number
  patientId: number
  type: string
  anomalyCount: number
  lastDetectedAt: string
}

export interface AlertCalmPayload {
  alertId: number
  patientId: number
  type: string
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

// ============== MONITOR TYPES ==============
export interface MonitorEcgSyncPayload {
  patientId: number
  deviceId: number
  packetEcg: Array<number>
  classInference: string | null
  timeInference: number | null
  inferenceReady?: boolean
  inferenceConfidence?: number | null
  beatCount?: number
  timestamp: string
}

export type MonitorJoinRejectedPayload = {
  roomName?: string
  patientId?: number
  reason: 'INVALID_ROOM' | 'FORBIDDEN' | 'SERVER_ERROR'
}
