export interface SystemStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalDevices: number
  devicesOnline: number
  devicesMaintenance: number
}

export interface DoctorStats {
  totalAppointmentsConfirmedToday: number
  totalAppointmentsPending: number
  totalAlertsPending: number
  totalUnreadConversations: number
}
