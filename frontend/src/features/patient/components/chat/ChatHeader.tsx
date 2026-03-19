import { ArrowLeft, Info, Phone, Video } from 'lucide-react'
import type { DoctorContact } from '@/features/patient/data/chatMockData'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  doctor: DoctorContact
  onBack: () => void
}

export const ChatHeader = ({ doctor, onBack }: ChatHeaderProps) => {
  return (
    <div className="z-50 border-b border-gray-100 bg-white p-2 md:ml-20 lg:ml-0">
      <div className="flex w-full items-center justify-between gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden">
            <ArrowLeft className="size-5" />
          </Button>

          <div className="relative shrink-0">
            <div
              className="h-10 w-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${doctor.avatarUrl}")` }}
            />
            {doctor.isOnline && (
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold">{doctor.name}</h2>
            <p className="text-sm">
              {doctor.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="text-teal-primary size-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="text-teal-primary size-6 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="fill-teal-primary size-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
