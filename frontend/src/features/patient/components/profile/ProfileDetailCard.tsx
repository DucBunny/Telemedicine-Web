import { FileUser, User } from 'lucide-react'
import type { Patient } from '@/features/patient/types'
import { GENDER_OPTIONS } from '@/features/patient/constants'
import { formatShortDate } from '@/lib/format-date'

interface ProfileAvatarCardProps {
  patient?: Patient
}

interface InfoItemProps {
  label: string
  value?: string
  className?: string
}

export const ProfileDetailCard = ({ patient }: ProfileAvatarCardProps) => {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-teal-primary flex items-center gap-2 text-lg font-bold">
          <User />
          Thông tin cơ bản
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InfoItem
          label="Ngày sinh"
          value={
            patient?.dateOfBirth
              ? formatShortDate(patient.dateOfBirth)
              : undefined
          }
        />
        <InfoItem
          label="Giới tính"
          value={GENDER_OPTIONS.find((g) => g.value === patient?.gender)?.label}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-teal-primary flex items-center gap-2 text-lg font-bold">
          <FileUser />
          Thông tin liên lạc
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <InfoItem label="Số điện thoại" value={patient?.user.phoneNumber} />
        <InfoItem label="Email" value={patient?.user.email} />
        <InfoItem
          label="Địa chỉ"
          value={patient?.address}
          className="md:col-span-2"
        />
      </div>
    </div>
  )
}

const InfoItem = ({ label, value, className }: InfoItemProps) => (
  <div className={className}>
    <p className="text-sm font-medium text-slate-600">{label}</p>
    <p className="font-semibold dark:text-white">{value || 'Chưa cập nhật'}</p>
  </div>
)
