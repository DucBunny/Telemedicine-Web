import type { MedicalRecord } from '@/features/patient/types'
import { Button } from '@/components/ui/button'
import { formatShortDate } from '@/lib/format-date'

interface RecordCardProps {
  record: MedicalRecord
  onClick?: (recordId: string) => void
}

export const RecordCard = ({ record, onClick }: RecordCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Tiêu đề & Trạng thái */}
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-lg font-bold">{record.diagnosis}</h4>

        <div className="mt-1 flex items-center gap-1 text-sm">
          {formatShortDate(record.appointment?.scheduledAt || '')}
        </div>
      </div>

      {/* Thông tin người phụ trách */}
      <div className="mb-3 flex items-center gap-2">
        {record.doctor?.user.avatar ? (
          <img
            src={record.doctor.user.avatar}
            alt={record.doctor.user.fullName}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
            {record.doctor?.user.fullName.charAt(0)}
          </div>
        )}
        <span className="text-sm md:text-base">
          {record.doctor?.degree}. {record.doctor?.user.fullName}
        </span>
      </div>

      {/* Lời chẩn đoán (nếu có) */}
      {record.symptoms && (
        <div className="mb-3 rounded-lg bg-gray-500/5 p-3">
          <p className="line-clamp-2 text-xs md:text-sm">
            <span className="font-semibold">Triệu chứng: </span>
            {record.symptoms}
          </p>
        </div>
      )}

      {/* Button Hành động */}
      <Button
        variant={'teal_primary'}
        size="lg"
        onClick={() => onClick?.(String(record.id))}
        className="w-full rounded-xl text-sm">
        Xem chi tiết
      </Button>
    </div>
  )
}
