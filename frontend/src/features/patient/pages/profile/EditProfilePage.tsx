import { useNavigate } from '@tanstack/react-router'
import { Cake, Camera, Check, Mail, MapPin, Phone, User } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  BLOOD_TYPE_OPTIONS,
  GENDER_OPTIONS,
} from '@/features/patient/constants'
import { uploadApi } from '@/features/patient/api/upload.api'
import { SelectField } from '@/components/form/SelectField'
import { DatePicker } from '@/components/form/DatePicker'
import {
  useGetPatientProfile,
  useUpdatePatientProfile,
} from '@/features/patient/hooks/usePatientQueries'
import { InputField } from '@/components/form/InputField'
import { TextAreaField } from '@/components/form/TextAreaField'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'

const patientSchema = z.object({
  user: z.object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    phoneNumber: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại')
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
  }),
  dateOfBirth: z.string().min(1, 'Vui lòng nhập ngày sinh'),
  gender: z.enum(['male', 'female', 'other'], 'Vui lòng chọn giới tính'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  height: z
    .string()
    .min(1, 'Vui lòng nhập chiều cao')
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .min(30, 'Chiều cao phải lớn hơn 30cm')
        .max(300, 'Chiều cao phải nhỏ hơn 300cm'),
    ),
  weight: z
    .string()
    .min(1, 'Vui lòng nhập cân nặng')
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .min(1, 'Cân nặng phải lớn hơn 1kg')
        .max(500, 'Cân nặng phải nhỏ hơn 500kg'),
    ),
  bloodType: z.enum(
    ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'unknown'],
    'Vui lòng chọn nhóm máu',
  ),
})

type PatientProfileFormData = z.input<typeof patientSchema>

export const EditProfilePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: patientProfile } = useGetPatientProfile()
  const updatePatientProfileMutation = useUpdatePatientProfile()

  // State cho avatar preview và pending file
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const pendingAvatarFile = useRef<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      user: {
        fullName: patientProfile?.user.fullName || '',
        phoneNumber: patientProfile?.user.phoneNumber || '',
        email: patientProfile?.user.email || '',
      },
      dateOfBirth: patientProfile?.dateOfBirth || '',
      gender: patientProfile?.gender || 'other',
      address: patientProfile?.address || '',
      height: String(patientProfile?.height) || '',
      weight: String(patientProfile?.weight) || '',
      bloodType: patientProfile?.bloodType || 'unknown',
    } as PatientProfileFormData,
    validators: {
      onSubmit: patientSchema,
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
          queryClient.invalidateQueries({ queryKey: ['patients', 'profile'] })
        }

        // Cập nhật thông tin profile (mutation tự động invalidate trong onSuccess)
        await updatePatientProfileMutation.mutateAsync(
          patientSchema.parse(value),
        )

        navigate({ to: '/patient/profile' })
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
        onBack={() => navigate({ to: '/patient/profile' })}
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
            <img
              className="border-teal-primary size-28 rounded-full border-2 bg-cover bg-center shadow-lg"
              src={
                (avatarPreview || patientProfile?.user.avatar) ??
                import.meta.env.VITE_DEFAULT_AVT
              }
              alt={patientProfile?.user.fullName}
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
            name="dateOfBirth"
            children={(field) => (
              <DatePicker
                label="Ngày sinh"
                placeholder="Chọn ngày sinh"
                field={field}
                rightIcon={Cake}
                className="h-12"
              />
            )}
          />

          <form.Field
            name="gender"
            children={(field) => (
              <SelectField
                options={GENDER_OPTIONS}
                label="Giới tính"
                placeholder="Chọn giới tính"
                field={field}
                rightIcon="wc"
                className="h-12!"
              />
            )}
          />

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
        </div>

        <div className="grid grid-cols-3 gap-3">
          <form.Field
            name="height"
            children={(field) => (
              <InputField
                label="Chiều cao"
                type="number"
                min="0"
                placeholder="(cm)"
                field={field}
                rightIcon={Cake}
                className="h-12"
              />
            )}
          />

          <form.Field
            name="weight"
            children={(field) => (
              <InputField
                label="Cân nặng"
                type="number"
                min="0"
                placeholder="(kg)"
                field={field}
                rightIcon="wc"
                className="h-12!"
              />
            )}
          />

          <form.Field
            name="bloodType"
            children={(field) => (
              <SelectField
                options={BLOOD_TYPE_OPTIONS}
                label="Nhóm máu"
                placeholder="A+, v.v"
                field={field}
                rightIcon="wc"
                className="h-12!"
              />
            )}
          />
        </div>

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
            onClick={() => navigate({ to: '/patient/profile' })}
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
                disabled={!canSubmit || isSubmitting}
                className="rounded-lg text-base font-bold active:scale-[0.98]">
                {isSubmitting ? 'Đang lưu...' : ' Lưu thay đổi'}
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
