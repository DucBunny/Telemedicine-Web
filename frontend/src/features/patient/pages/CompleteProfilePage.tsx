import { useNavigate } from '@tanstack/react-router'
import { Cake, Check, FileClock, MapPin, UserPlus } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  BLOOD_TYPE_OPTIONS,
  GENDER_OPTIONS,
} from '@/features/patient/constants'
import { completeProfileSchema } from '@/features/patient/schemas'
import { InputField } from '@/components/form/InputField'
import { SelectField } from '@/components/form/SelectField'
import { DatePicker } from '@/components/form/DatePicker'
import { TextAreaField } from '@/components/form/TextAreaField'
import { Button } from '@/components/ui/button'
import { useUpdatePatientProfile } from '@/features/patient/hooks/usePatientQueries'
import { useAuthStore } from '@/stores/auth.store'
import { getErrorMessage } from '@/lib/axios'

export const CompleteProfilePage = () => {
  const navigate = useNavigate()
  const updateProfileMutation = useUpdatePatientProfile()
  const setProfileComplete = useAuthStore((s) => s.setProfileComplete)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      dateOfBirth: '' as string | Date,
      gender: '',
      bloodType: '',
      height: '',
      weight: '',
      medicalHistory: '',
      address: '',
    },
    validators: {
      onSubmit: completeProfileSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        // await updateProfileMutation.mutateAsync(value)
        // setProfileComplete(true)
        console.log(
          'Thông tin hồ sơ hoàn chỉnh:',
          completeProfileSchema.parse(value),
        )
        toast.success('Hoàn thiện hồ sơ thành công!')
        navigate({ to: '/patient', replace: true })
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        setFormError(errorMessage)
        toast.error(errorMessage || 'Có lỗi xảy ra')
      }
    },
  })

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center">
      <div className="p-6 md:mx-auto md:rounded-2xl md:border md:border-gray-200 md:bg-white md:shadow-xl lg:p-8">
        {/* Header & Description */}
        <div className="mb-6 text-center">
          <div className="text-teal-primary mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-full bg-teal-100/50">
            <UserPlus className="size-6" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Hoàn thiện thông tin cá nhân
          </h1>
          <p className="text-sm text-slate-500">
            Vui lòng cung cấp một số thông tin cơ bản để chúng tôi có thể phục
            vụ bạn tốt hơn
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex-1 space-y-3 md:space-y-4">
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
                  onChange={() => setFormError(null)}
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
                  onChange={() => setFormError(null)}
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
                  onChange={() => setFormError(null)}
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
                  onChange={() => setFormError(null)}
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
                  onChange={() => setFormError(null)}
                />
              )}
            />
          </div>

          <form.Field
            name="address"
            children={(field) => (
              <TextAreaField
                label="Địa chỉ"
                placeholder="Nhập địa chỉ liên hệ"
                rightIcon={MapPin}
                field={field}
                onChange={() => setFormError(null)}
              />
            )}
          />

          <form.Field
            name="medicalHistory"
            children={(field) => (
              <TextAreaField
                label="Tiền sử bệnh lý"
                placeholder="Nhập tiền sử bệnh lý (nếu có)"
                rightIcon={FileClock}
                field={field}
                onChange={() => setFormError(null)}
              />
            )}
          />

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="pt-4 text-center">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="teal_primary"
                  disabled={!canSubmit || updateProfileMutation.isPending}
                  className="h-12 w-full rounded-xl text-base! font-bold active:scale-[0.98] lg:max-w-2/3">
                  <Check className="size-5" strokeWidth="2.5" />
                  {isSubmitting || updateProfileMutation.isPending
                    ? 'Đang lưu...'
                    : 'Hoàn tất'}
                </Button>
              )}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400 lg:text-sm">
              Bạn có thể chỉnh sửa thông tin này sau trong phần Thông tin cá
              nhân
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
