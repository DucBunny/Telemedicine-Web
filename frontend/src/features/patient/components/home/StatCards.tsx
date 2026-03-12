import type { Patient } from '@/features/patient/types'

interface StatCardsProps {
  profileData: Patient | undefined
}

interface StatInfo {
  id: string
  label: string
  value: string | number
  unit?: string
  icon: string
}

const StatCard = ({ stat }: { stat: StatInfo }) => (
  <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-teal-primary">
        {stat.icon}
      </span>
      <p className="text-xs font-medium text-slate-500 md:text-base">
        {stat.label}
      </p>
    </div>
    <p className="text-xl font-bold text-slate-900">
      {stat.value}{' '}
      {stat.unit && (
        <span className="text-sm font-normal text-slate-400">{stat.unit}</span>
      )}
    </p>
  </div>
)

export const StatCards = ({ profileData }: StatCardsProps) => {
  const STATS_DATA: Array<StatInfo> = [
    {
      id: '1',
      label: 'Chiều cao',
      value: profileData ? profileData.height : 'N/A',
      unit: 'cm',
      icon: 'height',
    },
    {
      id: '2',
      label: 'Cân nặng',
      value: profileData ? profileData.weight : 'N/A',
      unit: 'kg',
      icon: 'monitor_weight',
    },
    {
      id: '3',
      label: 'Nhóm máu',
      value: profileData ? profileData.bloodType : 'N/A',
      icon: 'bloodtype',
    },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {STATS_DATA.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
