import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  BriefcaseBusiness,
  Camera,
  Check,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import type { Doctor } from '@/features/doctors/types'

import {
  useGetProfile,
  useUpdateDoctorProfile,
} from '@/features/profile/hooks/useProfileQueries'
import { uploadApi } from '@/features/uploads/api/upload.api'
import { ChildPageHeader } from '@/components/common/PageHeader'
import { SafeImage } from '@/components/common/SafeImage'
import { InputField } from '@/components/form/InputField'
import { TextAreaField } from '@/components/form/TextAreaField'
import { useDoctorHeaderTitle } from '@/components/layouts/doctor'
import { Button } from '@/components/ui/button'

const doctorSchema = z.object({
  user: z.object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    phoneNumber: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại')
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
  }),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  degree: z.string().min(2, 'Trình độ phải có ít nhất 2 ký tự'),
  experienceYears: z
    .string()
    .min(1, 'Vui lòng nhập năm kinh nghiệm')
    .transform((val) => Number(val))
    .pipe(z.number().min(0, 'Năm kinh nghiệm phải lớn hơn hoặc bằng 0')),
  bio: z.string().min(10, 'Giới thiệu phải có ít nhất 10 ký tự'),
})

type DoctorProfileFormData = z.input<typeof doctorSchema>

export const EditProfilePage = () => {
  useDoctorHeaderTitle('Chỉnh sửa thông tin')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: doctorProfile } = useGetProfile<Doctor>()
  const { mutateAsync: updateDoctorProfile, isPending: isUpdatePending } =
    useUpdateDoctorProfile()

  // State cho avatar preview và pending file
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const pendingAvatarFile = useRef<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      user: {
        fullName: doctorProfile?.user.fullName || '',
        phoneNumber: doctorProfile?.user.phoneNumber || '',
        email: doctorProfile?.user.email || '',
      },
      address: doctorProfile?.address || '',
      degree: doctorProfile?.degree || '',
      experienceYears: String(doctorProfile?.experienceYears) || '',
      bio: doctorProfile?.bio || '',
    } as DoctorProfileFormData,
    validators: {
      onSubmit: doctorSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true)

        // Upload avatar nếu có file pending
        if (pendingAvatarFile.current) {
          toast.loading('Đang tải ảnh lên...', { id: 'upload-avatar' })
          await uploadApi.uploadAvatar(pendingAvatarFile.current)
          toast.success('Cập nhật ảnh đại diện thành công!', {
            id: 'upload-avatar',
          })
          // Invalidate sau khi upload avatar (vì uploadAvatar đã cập nhật DB)
          queryClient.invalidateQueries({ queryKey: ['profile', 'current'] })
        }

        // Cập nhật thông tin profile (mutation tự động invalidate trong onSuccess)
        await updateDoctorProfile(doctorSchema.parse(value))

        navigate({ to: '/doctor/settings' })
      } catch (error: unknown) {
        console.error('Lỗi khi lưu thông tin:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleAvatarChange = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      // Lưu file để upload khi submit
      pendingAvatarFile.current = file

      // Tạo preview URL
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
    input.click()
  }

  return (
    <div className="px-4">
      <ChildPageHeader
        title="Chỉnh sửa thông tin"
        onBack={() => navigate({ to: '/doctor/settings' })}
        className="lg:hidden"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-3 pb-23 md:pb-11 lg:mx-auto lg:max-w-3/4 lg:rounded-2xl lg:border lg:border-gray-200 lg:bg-white lg:p-6 lg:shadow xl:max-w-2/3">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <SafeImage
              className="border-teal-primary size-28 rounded-full border-2 bg-cover bg-center shadow-lg"
              src={avatarPreview || doctorProfile?.user.avatar}
              alt={doctorProfile?.user.fullName}
            />
            <Button
              type="button"
              onClick={handleAvatarChange}
              disabled={isSubmitting}
              size="icon"
              variant="teal_primary"
              className="absolute right-0 bottom-0 rounded-full">
              <Camera />
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Nhấn vào ảnh để thay đổi
          </p>
        </div>

        {/* Form Fields */}
        <form.Field
          name="user.fullName"
          children={(field) => (
            <InputField
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              rightIcon={User}
              field={field}
              className="h-12"
            />
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <form.Field
            name="user.email"
            children={(field) => (
              <InputField
                label="Email"
                type="email"
                placeholder="Email"
                rightIcon={Mail}
                field={field}
                className="h-12"
              />
            )}
          />

          <form.Field
            name="user.phoneNumber"
            children={(field) => (
              <InputField
                label="Số điện thoại"
                type="tel"
                placeholder="Số điện thoại"
                rightIcon={Phone}
                field={field}
                className="h-12"
              />
            )}
          />

          <form.Field
            name="degree"
            children={(field) => (
              <InputField
                label="Trình độ"
                type="text"
                placeholder="Trình độ"
                rightIcon={BriefcaseBusiness}
                field={field}
                className="h-12"
              />
            )}
          />

          <form.Field
            name="experienceYears"
            children={(field) => (
              <InputField
                label="Năm kinh nghiệm"
                type="number"
                placeholder="Kinh nghiệm"
                rightIcon="work_history"
                field={field}
                className="h-12"
              />
            )}
          />
        </div>

        <form.Field
          name="bio"
          children={(field) => (
            <TextAreaField
              label="Giới thiệu"
              placeholder="Giới thiệu"
              rightIcon="article_person"
              field={field}
            />
          )}
        />

        <form.Field
          name="address"
          children={(field) => (
            <TextAreaField
              label="Địa chỉ"
              placeholder="Địa chỉ"
              rightIcon={MapPin}
              field={field}
            />
          )}
        />

        <div className="mt-6 mb-0 hidden items-center justify-end gap-3 lg:flex">
          <Button
            type="button"
            onClick={() => navigate({ to: '/doctor/settings' })}
            variant="outline"
            size="lg"
            className="rounded-lg text-base font-bold active:scale-[0.98]">
            Hủy
          </Button>

          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <Button
                type="submit"
                variant="teal_primary"
                size="lg"
                disabled={!canSubmit || isSubmitting || isUpdatePending}
                className="rounded-lg text-base font-bold active:scale-[0.98]">
                {isSubmitting || isUpdatePending
                  ? 'Đang lưu...'
                  : ' Lưu thay đổi'}
              </Button>
            )}
          />
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed right-0 bottom-0 left-0 p-4 md:left-20 lg:hidden">
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <Button
                type="submit"
                variant="teal_primary"
                disabled={!canSubmit || isSubmitting}
                className="h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
                <Check className="size-5.5" strokeWidth="2.5" />
                Lưu thay đổi
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
