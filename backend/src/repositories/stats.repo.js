import { endOfDay, startOfDay } from 'date-fns'
import { Op } from 'sequelize'
import Conversation from '@/models/nosql/conversation'
import {
  Alert,
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

  const totalAppointmentsConfirmedToday = await Appointment.count({
    where: {
      doctorId,
      status: 'confirmed',
      scheduledAt: {
        [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
      },
    },
  })

  const totalAppointmentsPending = await Appointment.count({
    where: {
      doctorId,
      status: 'pending',
    },
  })

  const totalAlertsPending = await Alert.count({
    where: { status: 'pending' },
    include: [
      {
        model: Doctor,
        as: 'alertRecipients',
        attributes: [],
        where: { user_id: doctorId },
        required: true, // Inner join to filter alerts by doctor
      },
    ],
  })

  const totalUnreadConversations = await Conversation.countDocuments({
    participants: doctorId,
    [`unread_counts.${doctorId.toString()}`]: { $gt: 0 },
  })

  return {
    totalAppointmentsConfirmedToday,
    totalAppointmentsPending,
    totalAlertsPending,
    totalUnreadConversations,
  }
}
