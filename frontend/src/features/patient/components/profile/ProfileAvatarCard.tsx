import type { Patient } from '@/features/patient/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProfileAvatarCardProps {
  patient?: Patient
  onLogout?: () => void
}

export const ProfileAvatarCard = ({
  patient,
  onLogout,
}: ProfileAvatarCardProps) => (
  <div className="w-full bg-white lg:w-1/3 xl:w-1/4">
    <div className="flex h-full flex-col items-center rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
      <div className="relative mb-4 cursor-pointer">
        <div
          className="size-32 rounded-full border-3 bg-cover bg-center bg-no-repeat shadow-md"
          style={{ backgroundImage: `url("${patient?.user.avatar}")` }}
        />
      </div>

      <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
        {patient?.user.fullName}
      </h3>

      <Badge variant="teal_blur" className="rounded-full text-sm">
        ID Y tế: {patient?.userId}
      </Badge>

      <div className="mt-auto hidden w-full space-y-3 lg:block">
        <Button
          onClick={onLogout}
          size="lg"
          variant="red_blur"
          className="h-11 w-full rounded-xl text-base font-bold transition-colors hover:bg-red-100">
          Đăng xuất
        </Button>
      </div>
    </div>
  </div>
)
