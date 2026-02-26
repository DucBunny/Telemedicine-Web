import { Droplets, Heart } from 'lucide-react'
import type { HealthData } from '../../hooks/useHealthData'

interface VitalsGridProps {
  latestData: HealthData | null
}

export const VitalsGrid = ({ latestData }: VitalsGridProps) => {
  const vitalSign = [
    {
      id: 1,
      label: 'Nhịp tim',
      value: latestData?.bpm || '--',
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      id: 2,
      label: 'SpO2',
      value: latestData?.spo2 || '--',
      unit: '%',
      icon: Droplets,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
    },
  ]

  return (
    <div className="px-0 md:px-0">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-800">Chỉ số sức khỏe</h2>
        <span className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
          <span
            className={`mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full ${latestData ? 'bg-green-500' : 'bg-gray-400'}`}
          />
          {latestData ? 'Đang theo dõi' : 'Chưa có dữ liệu'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {vitalSign.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:shadow-md">
            <div className={`mb-3 rounded-full p-3 ${item.bg} ${item.color}`}>
              <item.icon size={28} />
            </div>
            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {item.value}{' '}
              <span className="text-sm font-normal text-gray-400">
                {item.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
