import { User, Doctor, Specialty } from '@/models/sql/index'

/**
 * Get doctor by user ID
 */
export const findByUserId = async (userId) => {
  return await Doctor.findOne({
    where: { user_id: userId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phoneNumber', 'role', 'avatar']
      },
      {
        model: Specialty,
        as: 'specialty',
        attributes: ['name']
      }
    ]
  })
}
