export interface Patient {
  id: number
  full_name: string
  avatar: string
  dob: string
  blood_type: string
  height: number
  weight: number
}

export interface VitalSign {
  id: number
  label: string
  value: string
  unit: string
  status: 'normal' | 'warning' | 'critical'
  icon: React.ComponentType<any>
  color: string
  bg: string
  description: string
}

export interface Appointment {
  id: number
  doctor: string
  specialization: string
  date: string
  time: string
  type: 'Online' | 'Tại phòng khám'
  status: 'confirmed' | 'pending' | 'cancelled'
}

export interface MedicalRecord {
  id: number
  date: string
  doctor: string
  diagnosis: string
  prescription: string
}

export interface Notification {
  id: number
  title: string
  content: string
  time: string
  is_read: boolean
  type: 'appointment' | 'alert' | 'chat' | 'general'
}
