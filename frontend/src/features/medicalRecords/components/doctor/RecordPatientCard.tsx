import type { MedicalRecord } from '@/features/medicalRecords/types'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { calculateAge, formatShortDate, formatTime } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/presence.store'
import { GENDER_OPTIONS } from '@/types/constants'

interface RecordPatientCardProps {
  record: MedicalRecord
}

export const RecordPatientCard = ({ record }: RecordPatientCardProps) => {
  const patient = record.patient
  const patientId = record.patientId

  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[patient?.userId ?? 0],
  )

  const genderLabel = patient
    ? (GENDER_OPTIONS.find((o) => o.value === patient.gender)?.label ?? '')
    : ''

  const subtitle = patient
    ? [calculateAge(patient.dateOfBirth) + ' tuổi', genderLabel]
        .filter(Boolean)
        .join(' • ')
    : ''

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <StatusAvatar
          className={cn(
            'size-14 rounded-full border-2 border-white/40 ring-2',
            isUserOnline ? 'ring-green-500' : 'ring-gray-300',
          )}
          src={patient?.user.avatar}
          alt={patient?.user.fullName ?? 'Bệnh nhân'}
          isUserOnline={isUserOnline}
          sizeDot="md"
        />

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-bold md:text-lg">
            {patient?.user.fullName ?? `Bệnh nhân #${patientId}`}
          </h4>
          <p className="truncate text-sm text-slate-600 md:text-base">
            {subtitle || patient?.user.email || '—'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm">Ngày tạo</p>
          <p className="text-sm font-semibold md:text-base">
            {formatShortDate(record.createdAt)}
          </p>
        </div>
        <div className="flex-1 text-end">
          <p className="text-xs md:text-sm">Giờ tạo</p>
          <p className="text-sm font-semibold md:text-base">
            {formatTime(record.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs md:text-sm">Bác sĩ thực hiện</p>
        <p className="text-sm font-semibold md:text-base">
          {record.doctor?.degree}. {record.doctor?.user.fullName}
        </p>
      </div>
    </div>
  )
}
