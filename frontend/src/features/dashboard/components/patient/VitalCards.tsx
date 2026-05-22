import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HealthData = {
  bpm: number
  spo2: number
}
interface VitalCardsProps {
  latestData: HealthData | null
}

interface VitalCardsGridProps {
  latestData: HealthData | null
  className?: string
}

interface VitalInfo {
  id: string
  label: string
  value: string | number
  unit: string
  icon: string
  colorClass: string
}

const VitalCard = ({ vital }: { vital: VitalInfo }) => (
  <div className="relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-center justify-center">
      <div
        className={`flex size-10 items-center justify-center rounded-full md:size-14 ${vital.colorClass}`}>
        <span
          className="material-symbols-outlined md:text-3xl!"
          style={{ fontVariationSettings: '"FILL" 1' }}>
          {vital.icon}
        </span>
      </div>
    </div>

    <p className="text-center text-sm font-medium text-slate-500">
      {vital.label}
    </p>

    <div className="flex items-baseline justify-center gap-1">
      <p className="text-2xl font-bold text-slate-900">{vital.value}</p>
      <span className="text-sm font-medium text-slate-400">{vital.unit}</span>
    </div>
  </div>
)

function buildVitals(latestData: HealthData | null): Array<VitalInfo> {
  return [
    {
      id: '1',
      label: 'Nhịp tim',
      value: latestData?.bpm ?? '--',
      unit: 'bpm',
      icon: 'ecg_heart',
      colorClass: 'bg-rose-50 text-rose-500',
    },
    {
      id: '2',
      label: 'SpO2',
      value: latestData?.spo2 ?? '--',
      unit: '%',
      icon: 'spo2',
      colorClass: 'bg-blue-50 text-blue-500',
    },
  ]
}

export const VitalCardsGrid = ({
  latestData,
  className,
}: VitalCardsGridProps) => {
  const vitals = buildVitals(latestData)

  return (
    <div className={cn('grid grid-cols-2 gap-3 md:gap-4', className)}>
      {vitals.map((vital) => (
        <VitalCard key={vital.id} vital={vital} />
      ))}
    </div>
  )
}

export const VitalCards = ({ latestData }: VitalCardsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between md:mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Chỉ số sức khỏe
        </h3>

        <Link to="/patient">
          <Button variant="link" className="text-teal-primary p-0 md:text-sm">
            Xem tất cả
          </Button>
        </Link>
      </div>

      <VitalCardsGrid latestData={latestData} />
    </div>
  )
}
