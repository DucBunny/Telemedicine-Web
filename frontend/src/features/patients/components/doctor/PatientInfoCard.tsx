import { Calendar, FileClock, MapPin, Phone } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import type { Patient } from '@/features/patients/types'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { calculateAge, formatShortDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/presence.store'
import { BLOOD_TYPE_OPTIONS, GENDER_OPTIONS } from '@/types/constants'

interface PatientInfoCardProps {
  patient: Patient
}

interface InfoItemProps {
  label: string
  value: string | number
  icon: LucideIcon | string
  className?: string
}

const InfoItem = ({ label, value, icon: Icon, className }: InfoItemProps) => (
  <div className={cn('space-y-1', className)}>
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
      {typeof Icon === 'string' ? (
        <span className="material-symbols-outlined text-base! text-slate-500">
          {Icon}
        </span>
      ) : (
        <Icon className="size-4 text-slate-500" />
      )}
      {label}
    </div>
    <p className="font-medium text-slate-900">{value}</p>
  </div>
)

export const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[patient.userId],
  )

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Patient Header */}
      <div className="mb-6 flex items-center gap-4 rounded-lg bg-slate-50 p-4">
        <StatusAvatar
          src={patient.user.avatar}
          alt={patient.user.fullName}
          isUserOnline={isUserOnline}
          className="size-16"
          sizeDot="md"
        />
        <div className="flex-1">
          <h3 className="mb-1 text-xl font-semibold text-slate-900">
            {patient.user.fullName || 'Chưa có tên'}
          </h3>
          <p className="mb-2 text-slate-600">{patient.user.email}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500 sm:gap-4 lg:gap-6">
            <span>{calculateAge(patient.dateOfBirth)} tuổi</span>
            <span>•</span>
            <span>
              {GENDER_OPTIONS.find((g) => g.value === patient.gender)?.label}
            </span>
            <span>•</span>
            <span>
              Nhóm máu{' '}
              {
                BLOOD_TYPE_OPTIONS.find((b) => b.value === patient.bloodType)
                  ?.label
              }
            </span>
          </div>
        </div>
      </div>

      {/* Patient Details Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <InfoItem
          label="Số điện thoại"
          value={patient.user.phoneNumber || 'Chưa cập nhật'}
          icon={Phone}
          className="md:order-last"
        />

        <InfoItem
          label="Ngày sinh"
          value={formatShortDate(patient.dateOfBirth)}
          icon={Calendar}
        />

        <InfoItem
          label="Chiều cao"
          value={`${patient.height} cm`}
          icon="height"
        />

        <InfoItem
          label="Cân nặng"
          value={`${patient.weight} kg`}
          icon="monitor_weight"
        />
      </div>

      {/* Additional Information */}
      <div className="mt-4 space-y-4">
        <InfoItem
          label="Địa chỉ"
          value={patient.address || 'Chưa cập nhật'}
          icon={MapPin}
        />

        {patient.medicalHistory && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <FileClock className="size-4" />
              Tiền sử bệnh
            </div>
            <p className="rounded-lg bg-slate-50 p-3 text-slate-900">
              {patient.medicalHistory}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
