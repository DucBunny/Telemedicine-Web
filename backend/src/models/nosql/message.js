import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    sender_id: {
      type: mongoose.Schema.Types.Mixed, // user_id từ SQL hoặc 'system'
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'system_alert'],
      default: 'text'
    },
    content: {
      text: { type: String },

      // Dùng cho type 'image' hoặc 'file'
      file_url: { type: String },
      file_name: { type: String },

      // Dùng cho type 'system_alert' (cảnh báo từ IoT/AI)
      alert_id: { type: Number },
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      value: { type: String }
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
)

// Index để tìm nhanh tin nhắn theo conversation_id và sắp xếp theo thời gian tạo
MessageSchema.index({ conversation_id: 1, created_at: -1 })

const Message = mongoose.model('Message', MessageSchema)

export default Message
