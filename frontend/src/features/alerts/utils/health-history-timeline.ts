import type { PatientHealthHistoryItem } from '@/features/alerts/types/alert.dto'

export type HealthTimelineVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'critical'
  | 'error'

export interface HealthTimelineDisplay {
  title: string
  subtitle: string
  variant: HealthTimelineVariant
  icon: string
}

const variantStyles: Record<
  HealthTimelineVariant,
  { iconBg: string; title: string }
> = {
  success: {
    iconBg: 'bg-green-100 text-green-600',
    title: 'text-green-600',
  },
  warning: {
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'text-amber-600',
  },
  info: {
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'text-blue-600',
  },
  critical: {
    iconBg: 'bg-red-100 text-red-600',
    title: 'text-red-600',
  },
  error: {
    iconBg: 'bg-slate-100 text-slate-600',
    title: 'text-slate-600',
  },
}

export const getHealthTimelineStyles = (variant: HealthTimelineVariant) =>
  variantStyles[variant]

const ECG_TIMELINE: Record<string, HealthTimelineDisplay> = {
  N: {
    title: 'Normal Sinus Rhythm',
    subtitle: 'Nhịp xoang bình thường',
    variant: 'success',
    icon: 'check_circle',
  },
  S: {
    // Supra ventricular ectopic
    title: 'SVEB Detected',
    subtitle: 'Phát hiện ngoại tâm thu trên thất',
    variant: 'warning',
    icon: 'ecg_heart',
  },
  V: {
    // Ventricular ectopic
    title: 'VEB Detected',
    subtitle: 'Phát hiện ngoại tâm thu thất',
    variant: 'critical',
    icon: 'ecg_heart',
  },
  F: {
    title: 'Fusion Beat Detected',
    subtitle: 'Phát hiện nhịp hỗn hợp',
    variant: 'info',
    icon: 'merge_type',
  },
  Q: {
    title: 'Unknown Rhythm Detected',
    subtitle: 'Phát hiện nhịp không xác định',
    variant: 'error',
    icon: 'error',
  },
}

const getStatusVariant = (
  status: PatientHealthHistoryItem['status'],
  fallback: HealthTimelineVariant,
): HealthTimelineVariant => {
  if (status === 'resolved') return 'success'
  if (status === 'handling') return 'info'
  return fallback
}

export const getHealthHistoryTimelineItem = (
  item: PatientHealthHistoryItem,
): HealthTimelineDisplay => {
  if (item.type.startsWith('ecg_')) {
    const ecgClass = item.type.replace('ecg_', '').toUpperCase()
    const base = ECG_TIMELINE[ecgClass] ?? {
      title: item.type.replace('ecg_', 'ECG '),
      subtitle: 'Phát hiện bất thường ECG',
      variant: 'critical' as const,
      icon: 'ecg_heart',
    }

    return {
      ...base,
      variant: getStatusVariant(item.status, base.variant),
    }
  }

  if (item.type === 'bpm') {
    return {
      title: 'Heart Rate Elevated',
      subtitle: `Nhịp tim ${item.value} bpm vượt ngưỡng an toàn`,
      variant: getStatusVariant(item.status, 'warning'),
      icon: 'warning',
    }
  }

  if (item.type === 'spo2') {
    return {
      title: 'SpO2 Alert',
      subtitle: `Nồng độ oxy ${item.value}% cần theo dõi`,
      variant: getStatusVariant(item.status, 'info'),
      icon: 'info',
    }
  }

  return {
    title: item.type,
    subtitle: `Giá trị ${item.value}`,
    variant: getStatusVariant(item.status, 'info'),
    icon: 'info',
  }
}
