import Conversation from '@/models/nosql/conversation'
import {
  AlertRecipient,
  Appointment,
  Device,
  Doctor,
  Patient,
  PatientDoctor,
  User,
} from '@/models/sql/index'

/**
 * Get admin dashboard statistics
 */
export const getSystemStats = async () => {
  const totalUsers = await User.count()
  const totalDoctors = await Doctor.count()
  const totalPatients = await Patient.count()
  const totalDevices = await Device.count()

  const devicesOnline = await Device.count({
    where: { status: 'active' },
  })

  const devicesMaintenance = await Device.count({
    where: { status: 'maintenance' },
  })

  return {
    totalUsers,
    totalDoctors,
    totalPatients,
    totalDevices,
    devicesOnline,
    devicesMaintenance,
  }
}

/**
 * Get doctor dashboard statistics
 */
export const getDoctorStats = async (doctorId) => {
  const totalPatients = await PatientDoctor.count({
    where: { doctorId },
  })
  const totalAppointments = await Appointment.count({
    where: { doctorId },
  })
  const totalAlerts = await AlertRecipient.count({
    where: {
      doctorId,
      isAcknowledged: false,
    },
  })
  const totalUnreadConversations = await Conversation.countDocuments({
    participants: doctorId,
    [`unread_counts.${doctorId.toString()}`]: { $gt: 0 },
  })

  return {
    totalPatients,
    totalAppointments,
    totalAlerts,
    totalUnreadConversations,
  }
}
