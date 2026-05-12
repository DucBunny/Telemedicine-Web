/**
 * Socket Types - TypeScript definitions
 */

export interface SocketInitOptions {
  userId?: number | string
  patientId?: number | string
  isDoctor?: boolean
}

export interface HealthData {
  deviceId: string
  patientId?: number
  bpm: number
  spo2: number
  hrv: number
  status: string
  prediction: unknown
  timestamp: number
}

export interface HealthAlert {
  deviceId: string
  patientId?: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  predictionId: string
  timestamp: number
}

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  createdAt: string
}

export interface DeviceStatus {
  deviceId: string
  status: 'online' | 'offline' | 'error'
  timestamp: number
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
}

export interface SocketChatMessage {
  id: string
  conversationId: string
  sender: ChatUser
  type: 'text' | 'image' | 'file' | 'system_alert'
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
