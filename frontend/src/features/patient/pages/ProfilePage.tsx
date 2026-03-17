import { Link, useNavigate } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useGetPatientProfile } from '@/features/patient/hooks/usePatientQueries'
import {
  ProfileAvatarCard,
  ProfileInfoGrid,
  ProfileSettingsSection,
} from '@/features/patient/components/profile/'
import { MainPageHeader } from '@/features/patient/components/common'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const logoutMutation = useLogoutMutation()
  const { data: patientProfile } = useGetPatientProfile()

  const handleEditAvatar = () => {
    navigate({ to: '/patient/profile/edit' })
  }

  const handleSettingClick = (settingId: string) => {
    switch (settingId) {
      case 'edit-info':
        navigate({ to: '/patient/profile/edit' })
        break
      case 'change-password':
        navigate({ to: '/patient/profile/change-password' })
        break
      case 'devices':
        console.log('Trang quản lý thiết bị chưa được tạo')
        break
      default:
        console.log('Mở cài đặt:', settingId)
    }
  }

  return (
    <div className="px-4">
      <MainPageHeader
        title="Thông tin cá nhân"
        rightAction={
          <Link to="/patient/notifications" className="relative z-10">
            <Button
              variant="outline"
              size="icon-lg"
              className="hover:text-teal-primary rounded-full border-slate-200 bg-white hover:bg-white/30">
              <Bell size={22} />
            </Button>
          </Link>
        }
      />

      <div className="mb-3 space-y-3">
        <ProfileAvatarCard
          patient={patientProfile}
          onEditAvatar={handleEditAvatar}
        />
        <ProfileInfoGrid patient={patientProfile} />
        <ProfileSettingsSection
          onLogout={() => logoutMutation.mutate()}
          onSettingClick={handleSettingClick}
        />
      </div>
    </div>
  )
}
