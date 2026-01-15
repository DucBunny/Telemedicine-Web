import * as appointmentRepo from '@/repositories/appointment.repo'

export const getAppointmentsByDoctorId = async (
  doctorId,
  { page = 1, limit = 10, status = [] }
) => {
  return await appointmentRepo.findByDoctorId(doctorId, {
    page,
    limit,
    status
  })
}

export const getAppointmentsByPatientId = async (
  patientId,
  { page = 1, limit = 10, status = [] }
) => {
  return await appointmentRepo.findByPatientId(patientId, {
    page,
    limit,
    status
  })
}
