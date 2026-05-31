import type { InsightVariant } from '@/features/dashboard/types/insight'

import { InsightCardShell } from '@/features/dashboard/components/patient/ai-insight'
import { cn } from '@/lib/utils'

interface AiDiagnosisCardProps {
  diagnosis: string
  confidence: number | null
  variant: InsightVariant
}

const formatConfidence = (confidence: number | null): string =>
  confidence == null ? '—' : `${confidence.toFixed(1)}%`

export const AiDiagnosisCard = ({
  diagnosis,
  confidence,
  variant,
}: AiDiagnosisCardProps) => (
  <InsightCardShell
    title="AI Diagnosis"
    description="Phân loại bất thường của AI">
    <div className="flex flex-1 flex-col justify-between gap-4">
      <div />
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-full',
            variant.accentBg,
          )}>
          <span
            className={cn(
              'material-symbols-outlined text-3xl!',
              variant.accent,
            )}
            style={{ fontVariationSettings: '"FILL" 1' }}>
            ecg_heart
          </span>
        </div>

        <p className={cn('text-xl leading-snug font-bold', variant.accent)}>
          {diagnosis}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          Confidence:{' '}
          <span className="font-semibold text-slate-800">
            {formatConfidence(confidence)}
          </span>
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              variant.progress,
            )}
            style={{
              width:
                confidence == null ? '0%' : `${Math.min(confidence, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  </InsightCardShell>
)
