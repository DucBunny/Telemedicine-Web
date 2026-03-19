import { MessageSquare } from 'lucide-react'
import type { DoctorInfo, RecordInfo } from '../../data/recordsMockData'
import { Button } from '@/components/ui/button'

interface RecordDoctorCardProps {
  doctor: DoctorInfo
  record: RecordInfo
}

export const RecordDoctorCard = ({ doctor, record }: RecordDoctorCardProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            className="h-14 w-14 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url("${doctor.avatarUrl}")` }}
          />
          {doctor.isOnline && (
            <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-base font-bold md:text-lg">{doctor.name}</h4>
          <p className="text-sm md:text-base">{doctor.specialty}</p>
        </div>

        <Button
          size="icon-lg"
          variant="teal_primary"
          className="flex shrink-0 rounded-full transition-colors">
          <MessageSquare className="size-4 fill-white" />
        </Button>
      </div>

      <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm">Ngày khám</p>
          <p className="text-sm font-semibold md:text-base">{record.date}</p>
        </div>
        <div className="flex-1 text-end">
          <p className="text-xs md:text-sm">Giờ khám</p>
          <p className="text-sm font-semibold md:text-base">{record.time}</p>
        </div>
      </div>
    </div>
  )
}
