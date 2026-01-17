import { Alert, Doctor } from '@/models/sql/index'

/**
 * Find alerts by doctor ID
 */
export const findByDoctorId = async (doctorId) => {
  return await Alert.findAll({
    include: [
      {
        model: Doctor,
        where: { user_id: doctorId }
      }
    ],
    order: [['createdAt', 'DESC']]
  })
}
