import * as medicalRecordRepo from '@/repositories/medicalRecord.repo'

export const getMedicalRecordsByDoctorId = async (
  doctorId,
  { page = 1, limit = 10 }
) => {
  return await medicalRecordRepo.findByDoctorId(doctorId, {
    page,
    limit
  })
}

export const getMedicalRecordsByPatientId = async (
  patientId,
  { page = 1, limit = 10 }
) => {
  return await medicalRecordRepo.findByPatientId(patientId, {
    page,
    limit
  })
}
