import React from 'react'
import type { StatusType } from '../types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  status: StatusType | string
  className?: string
}

export const DoctorStatusBadge: React.FC<Props> = ({ status, className }) => {
  const styles: Record<string, string> = {
    confirmed: 'bg-teal-100 text-teal-800 hover:bg-teal-100 border-transparent',
    pending:
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent',
    cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent',
    completed:
      'bg-green-100 text-green-800 hover:bg-green-100 border-transparent',
    normal: 'bg-green-100 text-green-800 hover:bg-green-100 border-transparent',
    warning:
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent',
    critical: 'bg-red-100 text-red-800 hover:bg-red-100 border-transparent',
    low: 'bg-blue-50 text-blue-700 hover:bg-blue-50 border-transparent',
    medium:
      'bg-orange-50 text-orange-700 hover:bg-orange-50 border-transparent',
  }

  const labels: Record<string, string> = {
    confirmed: 'Đã xác nhận',
    pending: 'Chờ duyệt',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành',
    normal: 'Ổn định',
    warning: 'Cần theo dõi',
    critical: 'Nguy hiểm',
    low: 'Thấp',
    medium: 'Trung bình',
  }

  return (
    <Badge
      variant="outline"
      className={cn(styles[status] || 'bg-gray-100 text-gray-800', className)}>
      {labels[status] || status}
    </Badge>
  )
}
