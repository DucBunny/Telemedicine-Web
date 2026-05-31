import { AlertTriangle, Check } from 'lucide-react'

import type { InsightVariant } from '@/features/dashboard/types/insight'

import { InsightCardShell } from '@/features/dashboard/components/patient/ai-insight'
import { cn } from '@/lib/utils'

interface ClinicalActionCardProps {
  action: string
  description: string
  variant: InsightVariant
  isNormal: boolean
}

export const ClinicalActionCard = ({
  action,
  description,
  variant,
  isNormal,
}: ClinicalActionCardProps) => (
  <InsightCardShell
    title="Clinical Action"
    description="Hành động cần thiết để xử lý bất thường">
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div
        className={cn(
          'flex size-14 items-center justify-center rounded-full border-3',
          isNormal ? 'border-green-500' : 'border-amber-500',
        )}>
        {isNormal ? (
          <Check className={cn('size-6 text-green-500')} strokeWidth={3} />
        ) : (
          <AlertTriangle
            className={cn('size-6 text-amber-500')}
            strokeWidth={3}
          />
        )}
      </div>

      {/* Clinical action */}
      <p className={cn('text-lg font-bold', variant.accent)}>{action}</p>

      {/* Clinical action description */}
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </InsightCardShell>
)
