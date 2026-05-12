import * as patientDoctorRepo from '@/repositories/patientDoctor.repo'

/**
 * Get related user IDs based on role
 * - Nếu role là patient, trả về danh sách doctorId của các bác sĩ liên quan
 * - Nếu role là doctor, trả về danh sách patientId của các bệnh nhân liên quan
 * - Trả về mảng rỗng nếu không tìm thấy hoặc role không hợp lệ
 *
 * Lưu ý: Hàm này chỉ trả về ID, không trả về thông tin chi tiết của user.
 */
export const getRelatedUserIds = async (userId, role) => {
  if (role === 'patient') {
    // Tìm các bác sĩ của bệnh nhân này
    const records = await patientDoctorRepo.getDoctorIdsByPatientId(userId)
    return records.map((r) => r.doctorId)
  } else if (role === 'doctor') {
    // Tìm các bệnh nhân của bác sĩ này
    const records = await patientDoctorRepo.getPatientIdsByDoctorId(userId)
    return records.map((r) => r.patientId)
  }

  // Role không hợp lệ hoặc không có mối quan hệ nào
  return []
}
