import { Droplets, Heart } from 'lucide-react'
import type {
  Appointment,
  MedicalRecord,
  Notification,
  Patient,
  VitalSign,
} from '../types'

export const MOCK_PATIENT: Patient = {
  id: 201,
  full_name: 'Trần Văn Cường',
  avatar: 'https://i.pravatar.cc/150?u=patient201',
  dob: '15/05/1990',
  blood_type: 'A+',
  height: 175,
  weight: 72,
}

export const MOCK_VITALS: Array<VitalSign> = [
  {
    id: 1,
    label: 'Nhịp tim',
    value: '78',
    unit: 'bpm',
    status: 'normal',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-50',
    description: 'Bình thường',
  },
  {
    id: 4,
    label: 'SpO2',
    value: '98',
    unit: '%',
    status: 'warning',
    icon: Droplets,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    description: 'Tốt',
  },
]

export const MOCK_APPOINTMENTS: Array<Appointment> = [
  {
    id: 1,
    doctor: 'BS. Nguyễn Văn An',
    specialization: 'Tim mạch',
    date: 'Hôm nay',
    time: '09:00',
    type: 'Online',
    status: 'confirmed',
  },
  {
    id: 2,
    doctor: 'BS. Lê Thị Bình',
    specialization: 'Nội tổng quát',
    date: '15/01/2024',
    time: '14:30',
    type: 'Tại phòng khám',
    status: 'pending',
  },
]

export const MOCK_RECORDS: Array<MedicalRecord> = [
  {
    id: 1,
    date: '20/11/2023',
    diagnosis: 'Viêm họng cấp',
    doctor: 'BS. Lê Thị Bình',
    prescription: 'Panadol, Vitamin C',
  },
  {
    id: 2,
    date: '05/10/2023',
    diagnosis: 'Kiểm tra sức khỏe định kỳ',
    doctor: 'BS. Nguyễn Văn An',
    prescription: 'Không có',
  },
]

export const MOCK_NOTIFICATIONS: Array<Notification> = [
  {
    id: 1,
    title: 'Nhắc lịch hẹn',
    content: 'Lịch khám với BS. An lúc 09:00 hôm nay.',
    time: '30p trước',
    is_read: false,
    type: 'appointment',
  },
  {
    id: 2,
    title: 'Cảnh báo nhịp tim',
    content: 'Nhịp tim cao bất thường (110bpm) lúc 2h sáng.',
    time: '5h trước',
    is_read: false,
    type: 'alert',
  },
  {
    id: 3,
    title: 'Tin nhắn mới',
    content: 'BS. Bình đã trả lời câu hỏi của bạn.',
    time: '1 ngày trước',
    is_read: true,
    type: 'chat',
  },
]
