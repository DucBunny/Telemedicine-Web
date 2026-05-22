import type { PatientHealthHistoryItem } from '@/features/alerts/types/alert.dto'

import { formatTime } from '@/lib/format-date'

const typeLabels: Record<string, string> = {
  bpm: 'nhịp tim',
  spo2: 'nồng độ oxy trong máu',
}

/**
 * Mô tả nhẹ nhàng cho bệnh nhân — không dùng từ ngữ gây lo lắng
 */
export const getPatientHealthHistoryMessage = (
  item: PatientHealthHistoryItem,
): string => {
  const metric = typeLabels[item.type] ?? 'chỉ số sức khỏe'
  const timeLabel = formatTime(item.createdAt)

  if (item.status === 'resolved') {
    return `Biến động ${metric} lúc ${timeLabel} đã được bác sĩ ghi nhận và theo dõi.`
  }

  if (item.status === 'handling') {
    return `Biến động ${metric} lúc ${timeLabel} đang được bác sĩ xem xét.`
  }

  return `Biến động ${metric} lúc ${timeLabel} đã được gửi tới bác sĩ.`
}
