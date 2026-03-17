import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema(
  {
    // Mảng chứa user_id (từ SQL) của Bác sĩ và Bệnh nhân
    participants: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => v.length === 2,
        message: 'Conversation phải có đúng 2 participants'
      }
    },

    // Nhúng trực tiếp tin nhắn cuối để hiển thị preview
    last_message: {
      message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      },
      sender_id: { type: mongoose.Schema.Types.Mixed }, // Number or 'system'
      type: {
        type: String,
        enum: ['text', 'image', 'file', 'system_alert']
      },
      content: { type: String },
      created_at: { type: Date }
    },

    // Đếm tin nhắn chưa đọc của từng người – key là user_id (string), value là số đếm
    unread_counts: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Index để tìm nhanh conversation theo participants
ConversationSchema.index({ participants: 1 })

const Conversation = mongoose.model('Conversation', ConversationSchema)

export default Conversation
