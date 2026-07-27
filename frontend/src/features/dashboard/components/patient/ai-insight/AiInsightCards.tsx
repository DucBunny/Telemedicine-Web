import type { InsightVariant } from '@/features/dashboard/types/insight'

import {
  AiConfidenceCard,
  AiDiagnosisCard,
  ClinicalActionCard,
  InferenceLatencyCard,
} from '@/features/dashboard/components/patient/ai-insight'
import {
  ABNORMAL_VARIANT,
  ECG_DIAGNOSIS,
  NORMAL_VARIANT,
} from '@/features/dashboard/types/insight'
import { cn } from '@/lib/utils'

interface AiInsightCardsProps {
  patientId?: number
  classInference?: string
  confidence?: number | null
  timeInference?: number | null
  className?: string
}

const getVariant = (classInference: string): InsightVariant =>
  classInference === 'N' ? NORMAL_VARIANT : ABNORMAL_VARIANT

const getDiagnosisLabel = (classInference: string): string =>
  ECG_DIAGNOSIS[classInference] ?? classInference

const getClinicalAction = (classInference: string) => {
  if (classInference === 'N')
    return {
      action: 'Continue monitoring',
      description: 'Không phát hiện bất thường',
    }

  return {
    action: 'Review immediately',
    description: 'Phát hiện bất thường — cần xem xét',
  }
}

export const AiInsightCards = ({
  patientId,
  classInference = '—',
  confidence = null,
  timeInference = null,
  className,
}: AiInsightCardsProps) => {
  const normalizedClass =
    classInference === '—' ? '—' : classInference.toUpperCase()
  const hasData = normalizedClass !== '—'
  const isNormal = normalizedClass === 'N'
  const variant = hasData ? getVariant(normalizedClass) : NORMAL_VARIANT
  const diagnosis = hasData ? getDiagnosisLabel(normalizedClass) : '—'
  const { action, description } = hasData
    ? getClinicalAction(normalizedClass)
    : { action: '—', description: 'Chờ dữ liệu ECG từ thiết bị' }
  const resolvedConfidence =
    confidence != null && confidence < 1 ? confidence * 100 : confidence

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 xl:grid-cols-4',
        className,
      )}>
      <AiDiagnosisCard
        diagnosis={diagnosis}
        confidence={resolvedConfidence}
        variant={variant}
      />
      <AiConfidenceCard
        confidence={resolvedConfidence}
        variant={variant}
        isNormal={isNormal}
      />
      <ClinicalActionCard
        action={action}
        description={description}
        variant={variant}
        isNormal={isNormal}
      />
      <InferenceLatencyCard latencyMs={timeInference} patientId={patientId} />
    </div>
  )
}
