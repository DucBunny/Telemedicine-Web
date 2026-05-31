import type { Patient } from '@/features/patients/types'

import { SafeImage } from '@/components/common/SafeImage'
import { calculateAge } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { GENDER_OPTIONS } from '@/types/constants'

interface ProfileCardProps {
  profileData: Patient | undefined
}

interface BodyStatProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}

const BodyStat = ({ label, value, unit, className }: BodyStatProps) => (
  <div
    className={cn(
      'flex flex-col gap-0.5 px-4 first:pl-0 last:pr-0',
      className,
    )}>
    <p className="text-center text-[10px] font-medium tracking-wide text-slate-400 uppercase md:text-xs">
      {label}
    </p>
    <p className="text-center text-base font-bold text-slate-900">
      {value}
      {unit && (
        <span className="ml-0.5 text-xs font-normal text-slate-500 md:text-sm">
          {unit}
        </span>
      )}
    </p>
  </div>
)

export const ProfileCard = ({ profileData }: ProfileCardProps) => {
  const genderLabel =
    GENDER_OPTIONS.find((g) => g.value === profileData?.gender)?.label ?? '—'
  const age = profileData?.dateOfBirth
    ? calculateAge(profileData.dateOfBirth)
    : '—'

  return (
    <div className="pb-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          {/* Avatar + tên */}
          <div className="flex items-center gap-4">
            <SafeImage
              src={profileData?.user.avatar}
              className="size-14 shrink-0 rounded-full border-2 border-white/40 ring-2 ring-green-500"
              alt={profileData?.user.fullName}
            />
            <div className="min-w-0 space-y-1">
              <h2 className="truncate text-xl leading-tight font-bold tracking-tight text-slate-900">
                {profileData?.user.fullName ?? '—'}
              </h2>
              {/* {subInfo && (
                <p className="text-sm font-medium text-slate-500">{subInfo}</p>
              )} */}
              <p className="space-x-2 text-sm font-medium text-slate-500 lg:space-x-5">
                <span>ID: {profileData?.userId}</span>
                {genderLabel !== '—' && <span>|</span>}
                {genderLabel !== '—' && <span>{genderLabel}</span>}
                {age !== '—' && <span>|</span>}
                {age !== '—' && <span>{age} tuổi</span>}
              </p>
            </div>
          </div>

          {/* Chỉ số cơ thể */}
          <div className="flex items-center border-t border-slate-200 pt-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div className="flex w-full divide-x divide-slate-200 lg:justify-start">
              <BodyStat
                label="Chiều cao"
                value={profileData?.height ?? '—'}
                unit="cm"
                className="max-lg:flex-1"
              />
              {/* <div className="w-px bg-slate-200" /> */}
              <BodyStat
                label="Cân nặng"
                value={profileData?.weight ?? '—'}
                unit="kg"
                className="max-lg:flex-1"
              />
              {/* <div className="w-px bg-slate-200" /> */}
              <BodyStat
                label="Nhóm máu"
                value={profileData?.bloodType ?? '—'}
                className="max-lg:flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
