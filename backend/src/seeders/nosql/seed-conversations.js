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

    const conversation = await Conversation.create({
      participants: [patientId, doctorId],
      unread_counts: new Map([
        [String(patientId), 0],
        [String(doctorId), 0]
      ])
    })

    seededConversations.push({
      conversation_id: conversation._id,
      patient_id: patientId,
      doctor_id: doctorId
    })
  }

  console.log(`${seededConversations.length} conversations created`)
  return seededConversations
}
