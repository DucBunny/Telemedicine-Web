import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGetPatientProfile } from '@/features/patient/hooks/usePatientQueries'
import { MainPageHeader } from '@/features/patient/components/common'
import {
  ProfileAvatarCard,
  ProfileDetailCard,
  SettingCard,
} from '@/features/patient/components/profile'
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'

export const ProfilePage = () => {
  const logoutMutation = useLogoutMutation()
  const { data: patientProfile } = useGetPatientProfile()

  return (
    <div className="px-4">
      <MainPageHeader title="Thông tin cá nhân" />

      <div className="flex flex-col gap-3 md:gap-6 lg:flex-row">
        <ProfileAvatarCard
          patient={patientProfile}
          onLogout={() => logoutMutation.mutate()}
        />

        <div className="w-full space-y-3 md:space-y-6 lg:mb-0 lg:w-2/3 xl:w-3/4">
          <ProfileDetailCard patient={patientProfile} />
          <SettingCard />
        </div>

        <Button
          onClick={() => logoutMutation.mutate()}
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
