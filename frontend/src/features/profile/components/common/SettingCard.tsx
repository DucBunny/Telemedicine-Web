import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, LockKeyhole, UserPen } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SettingOption {
  id: string
  icon: LucideIcon
  label: string
  iconBgClass: string
  iconTextClass: string
}

const SETTINGS_OPTIONS: Array<SettingOption> = [
  {
    id: 'edit',
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
]

interface SettingCardProps {
  routeBase: string
}

export const SettingCard = ({ routeBase }: SettingCardProps) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50/50 p-4">
        <h4 className="text-base font-semibold tracking-wide text-gray-500 uppercase">
          Cài đặt tài khoản
        </h4>
      </div>

      <div className="divide-y divide-gray-200">
        {SETTINGS_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              navigate({ to: `${routeBase}/${option.id}` })
            }}
            className="flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center rounded-lg p-2',
                  option.iconBgClass,
                  option.iconTextClass,
                )}>
                <option.icon className="size-6" />
              </div>
              <span className="text-base font-medium">{option.label}</span>
            </div>
            <ChevronRight className="text-teal-primary" />
          </button>
        ))}
      </div>
    </div>
  )
}
