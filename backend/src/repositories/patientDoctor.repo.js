import { PatientDoctor } from '@/models/sql/index'

/**
 * Ensure patient-doctor relationship exists
 * Đảm bảo mối quan hệ bệnh nhân-bác sĩ tồn tại, nếu chưa có thì tạo mới với vai trò 'primary' và ngày gán là ngày hiện tại
 */
export const ensurePatientDoctor = async (patientId, doctorId) => {
  const [record] = await PatientDoctor.findOrCreate({
    where: { patientId, doctorId },
    defaults: {
      patientId,
      doctorId,
      role: 'primary',
      assignedAt: new Date(),
    },
  })
  return record
}

/**
 * Get patient IDs relationships by doctor ID
 */
export const getPatientIdsByDoctorId = async (doctorId) => {
  return await PatientDoctor.findAll({
    where: { doctorId },
    attributes: ['patientId'],
  })
}

/**
 * Get doctor IDs relationships by patient ID
 */
export const getDoctorIdsByPatientId = async (patientId) => {
  return await PatientDoctor.findAll({
    where: { patientId },
    attributes: ['doctorId'],
  })
}
