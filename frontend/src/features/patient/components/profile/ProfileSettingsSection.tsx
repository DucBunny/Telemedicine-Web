import {
  ChevronRight,
  LockKeyhole,
  LogOut,
  MonitorSmartphone,
  UserPen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProfileSettingsSectionProps {
  onLogout?: () => void
  onSettingClick?: (settingId: string) => void
}

interface SettingOption {
  id: string
  icon: LucideIcon
  label: string
  iconBgClass: string
  iconTextClass: string
}

const SETTINGS_OPTIONS: Array<SettingOption> = [
  {
    id: 'edit-info',
    icon: UserPen,
    label: 'Chỉnh sửa thông tin',
    iconBgClass: 'bg-blue-100',
    iconTextClass: 'text-blue-600',
  },
  {
    id: 'change-password',
    icon: LockKeyhole,
    label: 'Đổi mật khẩu',
    iconBgClass: 'bg-orange-100',
    iconTextClass: 'text-orange-600',
  },
  {
    id: 'devices',
    icon: MonitorSmartphone,
    label: 'Thiết bị kết nối',
    iconBgClass: 'bg-purple-100',
    iconTextClass: 'text-purple-600',
  },
]

export const ProfileSettingsSection = ({
  onLogout,
  onSettingClick,
}: ProfileSettingsSectionProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-teal-primary text-base font-semibold tracking-tight uppercase">
        Cài đặt chung
      </h4>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {SETTINGS_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSettingClick?.(option.id)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center rounded-lg p-2',
                  option.iconBgClass,
                  option.iconTextClass,
                )}>
                <option.icon className="text-xl" />
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            <ChevronRight className="text-teal-primary" />
          </button>
        ))}
      </div>

      {onLogout && (
        <Button
          onClick={onLogout}
          size="lg"
          variant="red_blur"
          className="mt-3 h-12 w-full rounded-xl text-base font-bold transition-colors hover:bg-red-100">
          <LogOut className="size-5" strokeWidth="2.5" />
          Đăng xuất
        </Button>
      )}
    </div>
  )
}
