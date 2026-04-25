export interface SystemStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  totalDevices: number
  devicesOnline: number
  devicesMaintenance: number
}

export interface DoctorStats {
  totalPatients: number
  totalAppointments: number
  totalAlerts: number
  totalUnreadConversations: number
}
