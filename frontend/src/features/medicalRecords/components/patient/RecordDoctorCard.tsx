import type { MedicalRecord } from '@/features/medicalRecords/types'

import { SafeImage } from '@/components/common/SafeImage'
import { formatShortDate, formatTime } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { usePresenceStore } from '@/stores/presence.store'

interface RecordDoctorCardProps {
  record: MedicalRecord
}

export const RecordDoctorCard = ({ record }: RecordDoctorCardProps) => {
  const isUserOnline = usePresenceStore(
    (state) => !!state.onlineUsers[record.doctor?.userId ?? 0],
  )

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <SafeImage
            className={cn(
              'size-14 rounded-full border-2 border-white/40 ring-2',
              isUserOnline ? 'ring-green-500' : 'ring-gray-300',
            )}
            src={record.doctor?.user.avatar}
            alt={record.doctor?.user.fullName}
          />
          {isUserOnline && (
            <div className="absolute right-0 bottom-0 size-4 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-bold md:text-lg">
            {record.doctor?.user.fullName}
          </h4>
          <p className="truncate text-sm text-slate-600 md:text-base">
            {record.doctor?.specialty.name}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm">Ngày khám</p>
          <p className="text-sm font-semibold md:text-base">
            {formatShortDate(record.appointment?.scheduledAt || '')}
          </p>
        </div>
        <div className="flex-1 text-end">
          <p className="text-xs md:text-sm">Giờ khám</p>
          <p className="text-sm font-semibold md:text-base">
            {formatTime(record.appointment?.scheduledAt || '')}
          </p>
        </div>
      </div>
    </div>
  )
}
