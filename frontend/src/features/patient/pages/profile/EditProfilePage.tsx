import { useNavigate } from '@tanstack/react-router'
import { Cake, Check, MapPin, Phone, User } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { GenderSelect } from '@/components/form/GenderSelect'
import { DatePicker } from '@/components/form/DatePicker'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'
import { useGetPatientProfile } from '@/features/patient/hooks/usePatientQueries'
import { InputField } from '@/components/form/InputField'
import { TextAreaField } from '@/components/form/TextAreaField'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'

const patientSchema = z.object({
  user: z.object({
    fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    avatar: z.string().url('URL ảnh không hợp lệ').optional(),
    phoneNumber: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại')
      .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  }),
  dateOfBirth: z.string().min(1, 'Vui lòng nhập ngày sinh'),
  gender: z.enum(['male', 'female', 'other'], 'Vui lòng chọn giới tính'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
})

type PatientProfileFormData = z.infer<typeof patientSchema>

export const EditProfilePage = () => {
  useHideMobileNav()
  const navigate = useNavigate()
  const { data: patientProfile } = useGetPatientProfile()

  const form = useForm({
    defaultValues: {
      user: {
        fullName: patientProfile?.user.fullName || '',
        avatar: patientProfile?.user.avatar || '',
        phoneNumber: patientProfile?.user.phoneNumber || '',
      },
      dateOfBirth: patientProfile?.dateOfBirth || '',
      gender: patientProfile?.gender || 'other',
      address: patientProfile?.address || '',
    } as PatientProfileFormData,
    validators: {
      onSubmit: patientSchema,
    },
    onSubmit: ({ value }) => {
      try {
        // Gọi API để lưu thông tin cập nhật (chưa có API thực tế, chỉ log ra console)
        console.log('Thông tin cập nhật:', value)
        navigate({ to: '/patient/profile' })
      } catch (error) {
        console.error('Lỗi khi lưu thông tin:', error)
      }
    },
  })

  const handleAvatarChange = () => {
    console.log('Mở trình chọn ảnh...')
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
        <form.Field
          name="user.avatar"
          children={(field) => (
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <div
                  className="border-background-light dark:border-background-dark h-28 w-28 rounded-full border-4 bg-cover bg-center shadow-lg"
                  style={{ backgroundImage: `url("${field.state.value}")` }}
                />
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="bg-primary border-surface-light dark:border-surface-dark absolute right-0 bottom-0 flex items-center justify-center rounded-full border-2 p-2 text-white shadow-md transition-all hover:brightness-110">
                  <span className="material-symbols-outlined text-[18px]">
                    photo_camera
                  </span>
                </button>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark mt-3 text-xs">
                Nhấn vào ảnh để thay đổi
              </p>
            </div>
          )}
        />

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
              <GenderSelect
                label="Giới tính"
                placeholder="Chọn giới tính"
                field={field}
                rightIcon="wc"
                className="h-12!"
              />
            )}
          />
        </div>

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
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
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
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
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
