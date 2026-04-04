import { fakerVI as faker } from '@faker-js/faker'
import Conversation from '@/models/nosql/conversation'
import Message from '@/models/nosql/message'

const doctorMessages = [
  'Xin chào! Tôi đã xem kết quả xét nghiệm của bạn. Có vẻ ổn, nhưng cần theo dõi thêm.',
  'Bạn đã uống thuốc đầy đủ chưa? Nhớ uống sau ăn nhé.',
  'Kết quả siêu âm đã sẵn sàng. Hãy đến phòng khám trong tuần này.',
  'Huyết áp của bạn gần đây như thế nào? Bạn có đo tại nhà không?',
  'Chào bạn, lịch tái khám của bạn sắp đến rồi. Nhớ đặt lịch nhé!',
  'Tôi đã kê thêm đơn thuốc mới. Bạn có thể lấy tại nhà thuốc.'
]

const patientMessages = [
  'Kính chào bác sĩ! Hôm nay tôi thấy hơi mệt và đau đầu.',
  'Cảm ơn bác sĩ. Tôi đã uống thuốc đều đặn.',
  'Bác sĩ ơi, tình trạng của tôi có tiến triển tốt hơn không ạ?',
  'Đêm qua tôi khó thở một chút, có sao không bác sĩ?',
  'Tôi đã đặt lịch rồi ạ. Cảm ơn bác sĩ nhiều!',
  'Xin bác sĩ cho hỏi: tôi có thể ăn hải sản không ạ?',
  'Bác sĩ ơi, xét nghiệm máu của tôi có bình thường không ạ?'
]

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const clearMessages = async () => {
  await Message.deleteMany({})
}

/**
 * @param {Array<{conversation_id: import('mongoose').Types.ObjectId, patient_id: number, doctor_id: number}>} seededConversations
 */
export const seedMessages = async (seededConversations) => {
  let totalMessages = 0

  for (const item of seededConversations) {
    const { conversation_id, patient_id, doctor_id } = item

    const msgCount = faker.number.int({ min: 5, max: 10 })
    const now = Date.now()
    let lastMessage = null

    for (let i = 0; i < msgCount; i++) {
      const isDoctor = i % 2 === 1
      const senderId = isDoctor ? doctor_id : patient_id
      const text = isDoctor ? rand(doctorMessages) : rand(patientMessages)
      const createdAt = new Date(
        now - (msgCount - i) * faker.number.int({ min: 60000, max: 600000 })
      )

      const message = await Message.create({
        conversation_id,
        sender_id: senderId,
        type: 'text',
        content: { text },
        status: i < msgCount - 2 ? 'read' : 'delivered',
        created_at: createdAt
      })

      lastMessage = message
      totalMessages++
    }

    if (lastMessage) {
      const unreadForPatient = 1 + Math.floor(Math.random() * 2)

      await Conversation.findByIdAndUpdate(conversation_id, {
        last_message: {
          message_id: lastMessage._id,
          sender_id: lastMessage.sender_id,
          type: 'text',
          content: lastMessage.content.text,
          created_at: lastMessage.created_at
        },
        unread_counts: new Map([
          [String(patient_id), unreadForPatient],
          [String(doctor_id), 0]
        ])
      })
    }
  }

  console.log(`${totalMessages} messages seeded`)
}
