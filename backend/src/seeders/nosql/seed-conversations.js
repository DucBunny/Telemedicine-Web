import Conversation from '@/models/nosql/conversation'

export const clearConversations = async () => {
  await Conversation.deleteMany({})
}

/**
 * @param {Array<{patient_id: number, doctor_id: number}>} pairs
 */
export const seedConversations = async (pairs) => {
  const seededConversations = []

  for (const pair of pairs) {
    const patientId = Number(pair.patient_id)
    const doctorId = Number(pair.doctor_id)

    // Sort participants để đảm bảo tìm được conversation dù thứ tự khác nhau
    const participants = [patientId, doctorId].sort((a, b) => a - b)

    // Tìm conversation với cặp participants này (tìm cả 2 thứ tự)
    let conversation = await Conversation.findOne({
      participants: { $all: participants }
    })

    // Nếu chưa có, tạo mới
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        unread_counts: new Map([
          [String(patientId), 0],
          [String(doctorId), 0]
        ])
      })
    }

    seededConversations.push({
      conversation_id: conversation._id,
      patient_id: patientId,
      doctor_id: doctorId
    })
  }

  console.log(`${seededConversations.length} conversations seeded`)
  return seededConversations
}
