import { Loader, LogOut } from 'lucide-react'

import type { Patient } from '@/features/patients/types'

import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'
import {
  ProfileAvatarCard,
  SettingCard,
} from '@/features/profile/components/common'
import { ProfileDetailCard } from '@/features/profile/components/patient'
import { useGetProfile } from '@/features/profile/hooks/useProfileQueries'
import { MainPageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'

export const ProfilePage = () => {
  const { mutate: logout } = useLogoutMutation()
  const { data: patientProfile, isLoading, isError } = useGetProfile<Patient>()

  if (isLoading) return <Loader />

  if (isError)
    return (
      <div className="px-4">
        <MainPageHeader title="Thông tin cá nhân" />
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Không thể tải thông tin cá nhân</p>
        </div>
      </div>
    )

  return (
    <div className="px-4">
      <MainPageHeader title="Thông tin cá nhân" />

      <div className="flex flex-col gap-3 md:gap-6 lg:flex-row">
        <ProfileAvatarCard
          currentUser={patientProfile}
          onLogout={() => logout()}
        />

        <div className="w-full space-y-3 md:space-y-6 lg:mb-0 lg:w-2/3 xl:w-3/4">
          <ProfileDetailCard patient={patientProfile} />
          <SettingCard routeBase="/patient/profile" />
        </div>

        <Button
          onClick={() => logout()}
          size="lg"
          variant="red_blur"
          className="my-3 h-12 w-full rounded-xl text-base! font-bold transition-colors hover:bg-red-100 lg:hidden">
          <LogOut className="size-5" strokeWidth="2.5" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
