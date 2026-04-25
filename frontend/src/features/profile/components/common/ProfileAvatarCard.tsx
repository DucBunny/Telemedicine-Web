import type { Doctor } from '@/features/doctors/types'
import type { Patient } from '@/features/patients/types'

import { SafeImage } from '@/components/common/SafeImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProfileAvatarCardProps {
  currentUser?: Doctor | Patient
  onLogout?: () => void
}

export const ProfileAvatarCard = ({
  currentUser,
  onLogout,
}: ProfileAvatarCardProps) => (
  <div className="w-full lg:w-1/3 xl:w-1/4">
    <div className="flex h-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
      <SafeImage
        src={currentUser?.user.avatar}
        alt={currentUser?.user.fullName}
        className="mb-4 size-32 rounded-full bg-cover bg-center bg-no-repeat shadow-md"
      />

      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {currentUser?.user.fullName}
      </h3>

      <Badge variant="teal_blur" className="rounded-full text-sm">
        ID: {currentUser?.userId}
      </Badge>

      <div className="mt-auto hidden w-full space-y-3 lg:block">
        <Button
          onClick={onLogout}
          size="lg"
          variant="red_blur"
          className="h-11 w-full rounded-xl text-base! font-bold transition-colors hover:bg-red-100">
          Đăng xuất
        </Button>
      </div>
    </div>
  </div>
)
