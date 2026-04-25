import { FileUser, User } from 'lucide-react'

import type { Doctor } from '@/features/doctors/types'

interface ProfileAvatarCardProps {
  doctor?: Doctor
}

interface InfoItemProps {
  label: string
  value?: string
  className?: string
}

export const ProfileDetailCard = ({ doctor }: ProfileAvatarCardProps) => {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-teal-primary flex items-center gap-2 text-lg font-bold">
          <User />
          Thông tin cơ bản
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Trình độ" value={doctor?.degree} />
        <InfoItem
          label="Kinh nghiệm"
          value={doctor?.experienceYears.toString() + ' năm'}
        />
        <InfoItem
          label="Giới thiệu"
          value={doctor?.bio}
          className="col-span-2"
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-teal-primary flex items-center gap-2 text-lg font-bold">
          <FileUser />
          Thông tin liên lạc
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <InfoItem label="Số điện thoại" value={doctor?.user.phoneNumber} />
        <InfoItem label="Email" value={doctor?.user.email} />
        <InfoItem
          label="Địa chỉ khám"
          value={doctor?.address}
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
