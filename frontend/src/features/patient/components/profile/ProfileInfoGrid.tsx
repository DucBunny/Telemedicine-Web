import { Cake, MapPin, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Patient } from '@/features/patient/types'
import { formatShortDate } from '@/lib/format-date'
import { genderOptions } from '@/components/form/GenderSelect'
import { cn } from '@/lib/utils'

interface ProfileInfoGridProps {
  patient?: Patient
}

interface InfoCardProps {
  icon: LucideIcon | string
  label: string
  data?: string
  className?: React.HTMLAttributes<HTMLDivElement>['className']
}

export const ProfileInfoGrid = ({ patient }: ProfileInfoGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Ngày sinh */}
      <InfoCard
        icon={Cake}
        label="Ngày sinh"
        data={formatShortDate(patient?.dateOfBirth || '')}
      />

      {/* Giới tính */}
      <InfoCard
        icon="wc"
        label="Giới tính"
        data={genderOptions.find((o) => o.value === patient?.gender)?.label}
      />

      {/* Điện thoại */}
      <InfoCard
        icon={Phone}
        label="Điện thoại"
        data={patient?.user.phoneNumber}
        className="col-span-2"
      />

      {/* Địa chỉ */}
      <InfoCard
        icon={MapPin}
        label="Địa chỉ"
        data={patient?.address}
        className="col-span-2"
      />
    </div>
  )
}

const InfoCard = ({ icon: Icon, label, data, className }: InfoCardProps) => (
  <div
    className={cn(
      'flex flex-col gap-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm',
      className,
    )}>
    <div className="flex h-6 items-center gap-1">
      {typeof Icon === 'string' ? (
        <span className="material-symbols-outlined text-teal-primary">
          {Icon}
        </span>
      ) : (
        <Icon className="text-teal-primary size-5" />
      )}

      <span className="text-teal-primary text-sm font-medium">{label}</span>
    </div>
    <p className="text-sm font-semibold">{data}</p>
  </div>
)
