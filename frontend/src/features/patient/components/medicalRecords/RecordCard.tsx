import { Button } from '@/components/ui/button'

export type RecordStatus = 'Tái khám' | 'Hoàn thành' | 'Điều trị'

export interface MedicalRecord {
  id: string
  title: string
  date: string
  status?: RecordStatus
  providerName: string
  providerAvatar?: string
  providerInitials?: string
  diagnosis?: string
  isPrimaryAction?: boolean // Nút hành động nổi bật (Màu Primary) hay viền xám
}

interface RecordCardProps {
  record: MedicalRecord
  onClick?: (recordId: string) => void
}

export const RecordCard = ({ record, onClick }: RecordCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Tiêu đề & Trạng thái */}
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-lg font-bold">{record.title}</h4>

        <div className="mt-1 flex items-center gap-1 text-sm">
          {record.date}
        </div>
      </div>

      {/* Thông tin người phụ trách */}
      <div className="mb-3 flex items-center gap-2">
        {record.providerAvatar ? (
          <img
            src={record.providerAvatar}
            alt={record.providerName}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
            {record.providerInitials}
          </div>
        )}
        <span className="text-sm md:text-base">{record.providerName}</span>
      </div>

      {/* Lời chẩn đoán (nếu có) */}
      {record.diagnosis && (
        <div className="mb-3 rounded-lg bg-gray-500/5 p-3">
          <p className="line-clamp-2 text-xs md:text-sm">
            <span className="font-semibold">Chẩn đoán: </span>
            {record.diagnosis}
          </p>
        </div>
      )}

      {/* Button Hành động */}
      <Button
        variant={record.isPrimaryAction ? 'teal_primary' : 'outline'}
        size="lg"
        onClick={() => onClick?.(record.id)}
        className="w-full rounded-xl text-sm">
        Xem chi tiết
      </Button>
    </div>
  )
}
