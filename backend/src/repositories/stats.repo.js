import {
  User,
  Doctor,
  Patient,
  Device,
  PatientDoctor,
  Appointment,
  Alert,
  Message
} from '@/models/index'

/**
 * Get admin dashboard statistics
 */
export const getSystemStats = async () => {
  const totalUsers = await User.count()
  const totalDoctors = await Doctor.count()
  const totalPatients = await Patient.count()
  const totalDevices = await Device.count()

  const devicesOnline = await Device.count({
    where: { status: 'active' }
  })

  const devicesMaintenance = await Device.count({
    where: { status: 'maintenance' }
  })

  return {
    totalUsers,
    totalDoctors,
    totalPatients,
    totalDevices,
    devicesOnline,
    devicesMaintenance
  }
}

/**
 * Get doctor dashboard statistics
 */
export const getDoctorStats = async (doctorId) => {
  const totalPatients = await PatientDoctor.count({
    where: { doctorId }
  })
  const totalAppointments = await Appointment.count({
    where: { doctorId }
  })
  const totalAlerts = await Alert.count({
    include: [
      {
        model: Doctor,
        as: 'doctors',
        where: { user_id: doctorId }
      }
    ]
  })
  const totalUnreadMessages = await Message.count({
    where: { doctorId, isRead: false }
  })

  return {
    totalPatients,
    totalAppointments,
    totalAlerts,
    totalUnreadMessages
  }
}
