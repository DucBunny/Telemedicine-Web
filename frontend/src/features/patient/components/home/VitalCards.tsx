import { Link } from '@tanstack/react-router'
import type { HealthData } from '@/features/patient/hooks/useHealthData'
import { Button } from '@/components/ui/button'

interface VitalCardsProps {
  latestData: HealthData | null
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

export const VitalCards = ({ latestData }: VitalCardsProps) => {
  const VITALS_DATA: Array<VitalInfo> = [
    {
      id: '1',
      label: 'Nhịp tim',
      value: latestData?.bpm || '--',
      unit: 'bpm',
      icon: 'ecg_heart',
      colorClass: 'bg-rose-50 text-rose-500',
    },
    {
      id: '2',
      label: 'SpO2',
      value: latestData?.spo2 || '--',
      unit: '%',
      icon: 'spo2',
      colorClass: 'bg-blue-50 text-blue-500',
    },
  ]

  return (
    <div>
      {/* Header */}
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

      {/* Status */}
      {/* <div className="mb-2 flex items-center justify-end">
        <span className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
          <span
            className={`mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full ${latestData ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          {latestData ? 'Đang theo dõi' : 'Chưa có dữ liệu'}
        </span>
      </div> */}

      {/* Vitals */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {VITALS_DATA.map((vital) => (
          <VitalCard key={vital.id} vital={vital} />
        ))}
      </div>
    </div>
  )
}
