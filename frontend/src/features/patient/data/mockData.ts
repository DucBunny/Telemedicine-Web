import { Droplets, Heart } from 'lucide-react'
import type { Notification, VitalSign } from '../types'

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
