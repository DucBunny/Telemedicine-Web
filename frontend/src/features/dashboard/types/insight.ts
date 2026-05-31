export interface InsightVariant {
  accent: string
  accentBg: string
  progress: string
  ring: string
}

export const NORMAL_VARIANT: InsightVariant = {
  accent: 'text-green-600',
  accentBg: 'bg-green-50',
  progress: 'bg-green-500',
  ring: '#22c55e',
}

export const ABNORMAL_VARIANT: InsightVariant = {
  accent: 'text-amber-600',
  accentBg: 'bg-amber-50',
  progress: 'bg-amber-500',
  ring: '#f59e0b',
}

export const ECG_DIAGNOSIS: Record<string, string> = {
  N: 'Nhịp xoang bình thường',
  S: 'Nhịp ngoại tâm thu trên thất (S)',
  V: 'Nhịp ngoại tâm thu thất (V)',
  F: 'Nhịp hợp nhất (F)',
  Q: 'Nhịp không xác định (Q)',
}
