import { AlertTriangle, Calendar, MessageSquare, Users } from 'lucide-react'
import { MOCK_STATS } from './data/mockData'

export const DASHBOARD_STATS = [
  {
    label: 'Tổng bệnh nhân',
    value: MOCK_STATS.total_patients,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Lịch hẹn',
    value: MOCK_STATS.appointments_today,
    icon: Calendar,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    label: 'Cảnh báo',
    value: MOCK_STATS.pending_alerts,
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    label: 'Tin nhắn',
    value: MOCK_STATS.messages_unread,
    icon: MessageSquare,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
]
