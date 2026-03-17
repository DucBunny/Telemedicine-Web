import { Pencil } from 'lucide-react'
import type { Patient } from '@/features/patient/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProfileAvatarCardProps {
  patient?: Patient
  onEditAvatar?: () => void
}

export const ProfileAvatarCard = ({
  patient,
  onEditAvatar,
}: ProfileAvatarCardProps) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="relative mb-4">
        <div
          className="size-24 rounded-full border-3 bg-cover bg-center bg-no-repeat shadow-md"
          style={{ backgroundImage: `url("${patient?.user.avatar}")` }}
        />
        {onEditAvatar && (
          <Button
            onClick={onEditAvatar}
            variant="teal_primary"
            size="icon-sm"
            className="absolute right-0 bottom-0 rounded-full border-2 border-white hover:brightness-110">
            <Pencil className="size-4" strokeWidth="2.5" />
          </Button>
        )}
      </div>
      <h3 className="mb-1 text-xl font-bold">{patient?.user.fullName}</h3>
      <Badge variant="teal_blur" className="rounded-full text-sm">
        ID Y tế: {patient?.userId}
      </Badge>
    </div>
  )
}
