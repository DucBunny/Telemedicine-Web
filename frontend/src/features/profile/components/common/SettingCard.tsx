import { useNavigate } from '@tanstack/react-router'
import { ChevronRight, HeartPulse, LockKeyhole, UserPen } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/features/auth/types/auth.types'

import { cn } from '@/lib/utils'

interface SettingOption {
  id: string
  icon: LucideIcon
  label: string
  iconBgClass: string
  iconTextClass: string
  href: string
  roles: Array<UserRole>
  routeBase: boolean
}

interface SettingCardProps {
  routeBase: string
  role: UserRole
}

const SETTINGS_OPTIONS: Array<SettingOption> = [
  {
    id: 'edit',
    icon: UserPen,
    label: 'Chỉnh sửa thông tin',
    iconBgClass: 'bg-blue-100',
    iconTextClass: 'text-blue-600',
    href: '/edit',
    roles: ['doctor', 'patient'],
    routeBase: true,
  },
  {
    id: 'change-password',
    icon: LockKeyhole,
    label: 'Đổi mật khẩu',
    iconBgClass: 'bg-orange-100',
    iconTextClass: 'text-orange-600',
    href: '/change-password',
    roles: ['doctor', 'patient'],
    routeBase: true,
  },
  {
    id: 'health-history',
    icon: HeartPulse,
    label: 'Lịch sử sức khỏe',
    iconBgClass: 'bg-teal-100',
    iconTextClass: 'text-teal-600',
    href: '/health-history',
    roles: ['patient'],
    routeBase: false,
  },
]

export const SettingCard = ({ routeBase, role }: SettingCardProps) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50/50 p-4">
        <h4 className="text-base font-semibold tracking-wide text-gray-500 uppercase">
          Cài đặt tài khoản
        </h4>
      </div>

      <div className="divide-y divide-gray-200">
        {SETTINGS_OPTIONS.filter((option) => option.roles.includes(role)).map(
          (option) => (
            <button
              key={option.id}
              onClick={() => {
                navigate({
                  to: `/${role}${option.routeBase ? routeBase : ''}${option.href}`,
                })
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
          ),
        )}
      </div>
    </div>
  )
}
