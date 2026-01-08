import type {
  Alert,
  Appointment,
  ChatMessage,
  DashboardStats,
  DoctorUser,
  Patient,
} from '../types'

export const MOCK_USER_DOCTOR: DoctorUser = {
  id: 101,
  full_name: 'BS. Nguyễn Văn A',
  specialization: 'Tim mạch',
  degree: 'Tiến sĩ',
  avatar: 'https://i.pravatar.cc/150?u=doctor',
  role: 'doctor',
}

export const MOCK_STATS: DashboardStats = {
  total_patients: 124,
  appointments_today: 8,
  pending_alerts: 3,
  messages_unread: 5,
}

// Dữ liệu Appointment (Table appointments)
export const MOCK_APPOINTMENTS: Array<Appointment> = [
  {
    id: 1,
    patient_name: 'Trần Thị B',
    time: '08:30',
    date: '2023-12-29',
    reason: 'Đau ngực trái',
    status: 'confirmed',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    patient_name: 'Lê Văn C',
    time: '09:15',
    date: '2023-12-29',
    reason: 'Tái khám huyết áp',
    status: 'confirmed',
    type: 'Khám từ xa',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    patient_name: 'Phạm Minh D',
    time: '10:00',
    date: '2023-12-29',
    reason: 'Tư vấn kết quả xét nghiệm',
    status: 'pending',
    type: 'Khám từ xa',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    patient_name: 'Nguyễn Thu E',
    time: '14:00',
    date: '2023-12-29',
    reason: 'Khó thở nhẹ',
    status: 'cancelled',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 5,
    patient_name: 'Hoàng Văn F',
    time: '08:00',
    date: '2023-12-30',
    reason: 'Kiểm tra định kỳ',
    status: 'confirmed',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: 6,
    patient_name: 'Vũ Thị G',
    time: '09:30',
    date: '2023-12-30',
    reason: 'Tư vấn dinh dưỡng',
    status: 'pending',
    type: 'Khám từ xa',
    avatar: 'https://i.pravatar.cc/150?u=6',
  },
]

// Dữ liệu Alerts (Table alerts & health_predictions)
export const MOCK_ALERTS: Array<Alert> = [
  {
    id: 1,
    patient_name: 'Lê Văn C',
    message: 'Nhịp tim vượt ngưỡng (120 bpm)',
    severity: 'critical',
    time: '10 phút trước',
    source: 'IoT Device',
  },
  {
    id: 2,
    patient_name: 'Trần Thị B',
    message: 'Huyết áp tăng nhẹ',
    severity: 'medium',
    time: '30 phút trước',
    source: 'AI Prediction',
  },
  {
    id: 3,
    patient_name: 'Hoàng Văn F',
    message: 'Pin thiết bị yếu',
    severity: 'low',
    time: '1 giờ trước',
    source: 'System',
  },
]

// Dữ liệu Patients (Table patients & users)
export const MOCK_PATIENTS: Array<Patient> = [
  {
    id: 1,
    full_name: 'Trần Thị B',
    gender: 'female',
    age: 34,
    blood_type: 'O+',
    height: 160,
    weight: 55,
    last_visit: '2023-10-20',
    health_status: 'warning',
    condition: 'Huyết áp cao',
  },
  {
    id: 2,
    full_name: 'Lê Văn C',
    gender: 'male',
    age: 45,
    blood_type: 'A+',
    height: 172,
    weight: 70,
    last_visit: '2023-10-25',
    health_status: 'critical',
    condition: 'Rối loạn nhịp tim',
  },
  {
    id: 3,
    full_name: 'Phạm Minh D',
    gender: 'male',
    age: 28,
    blood_type: 'AB',
    height: 168,
    weight: 65,
    last_visit: '2023-10-26',
    health_status: 'normal',
    condition: 'Sức khỏe tốt',
  },
  {
    id: 4,
    full_name: 'Nguyễn Thu E',
    gender: 'female',
    age: 52,
    blood_type: 'B+',
    height: 155,
    weight: 60,
    last_visit: '2023-10-15',
    health_status: 'normal',
    condition: 'Tiểu đường nhẹ',
  },
  {
    id: 5,
    full_name: 'Hoàng Văn F',
    gender: 'male',
    age: 61,
    blood_type: 'A-',
    height: 170,
    weight: 75,
    last_visit: '2023-10-01',
    health_status: 'warning',
    condition: 'Suy thận độ 1',
  },
]

// Dữ liệu Chat (Table chat_messages)
export const MOCK_CHATS: Array<ChatMessage> = [
  {
    id: 1,
    user_name: 'Trần Thị B',
    last_message:
      'Bác sĩ ơi, thuốc này uống sau ăn được không ạ?Bác sĩ ơi, thuốc này uống sau ăn được không ạ?Bác sĩ ơi, thuốc này uống sau ăn được không ạ?Bác sĩ ơi, thuốc này uống sau ăn được không ạ?',
    time: '08:45',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    user_name: 'Lê Văn C',
    last_message: 'Tôi đã gửi chỉ số huyết áp sáng nay.',
    time: 'Hôm qua',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    user_name: 'Phạm Minh D',
    last_message: 'Cảm ơn bác sĩ nhiều ạ.',
    time: 'Hôm qua',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
]
