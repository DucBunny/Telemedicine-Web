export type MessageStatus = 'sent' | 'read'

export type MessageType = 'text' | 'image' | 'file' | 'system_alert'

export interface ChatUser {
  id: number
  fullName: string
  avatar?: string
}

export interface ChatMessageContent {
  text?: string
  file_url?: string
  file_name?: string
}

export interface ChatMessage {
  id: string
  sender: ChatUser
  type: MessageType
  content: ChatMessageContent
  status: MessageStatus
  createdAt: string
}

export interface ChatConversation {
  id: string
  participants?: Array<number>
  user: ChatUser
  lastMessage: {
    message: string
    createdAt: string
    type: MessageType
  } | null
  unreadCount: number
}
