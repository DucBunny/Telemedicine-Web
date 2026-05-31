import type { InsightVariant } from '@/features/dashboard/types/insight'

import { InsightCardShell } from '@/features/dashboard/components/patient/ai-insight'
import { cn } from '@/lib/utils'

interface AiConfidenceCardProps {
  confidence: number | null
  variant: InsightVariant
  isNormal: boolean
}

const formatConfidence = (confidence: number | null): string =>
  confidence == null ? '—' : `${confidence.toFixed(1)}%`

const getConfidenceLabel = (confidence: number | null, isNormal: boolean) => {
  if (confidence == null) return 'Chưa có dữ liệu'
  if (confidence >= 90) return 'Độ tin cậy cao'
  if (confidence >= 70) return 'Độ tin cậy trung bình'
  return isNormal ? 'Độ tin cậy thấp' : 'Cần xác minh thêm'
}

export const AiConfidenceCard = ({
  confidence,
  variant,
  isNormal,
}: AiConfidenceCardProps) => {
  const size = 128
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = confidence == null ? 0 : Math.min(confidence, 100)
  const offset = circumference - (progress / 100) * circumference

  return (
    <InsightCardShell
      title="AI Confidence"
      description="Độ tin cậy của AI trong việc phát hiện bất thường">
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="-rotate-90"
            aria-hidden="true">
            {/* Circle background */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />

            {/* Circle progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={variant.ring}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>

          {/* Confidence value */}
          <span
            className={cn(
              'absolute text-2xl font-bold',
              confidence == null ? 'text-slate-400' : variant.accent,
            )}>
            {formatConfidence(confidence)}
          </span>
        </div>

        {/* Confidence label */}
        <p className="text-center text-base text-slate-600">
          {getConfidenceLabel(confidence, isNormal)}
        </p>
      </div>
    </InsightCardShell>
  )
}
