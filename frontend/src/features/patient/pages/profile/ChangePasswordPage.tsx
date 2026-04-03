import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { CircleCheck, LockKeyhole, LockKeyholeOpen, Save } from 'lucide-react'
import { z } from 'zod'
import { useChangePassword } from '@/features/patient/hooks/usePatientQueries'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/form/InputField'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu mới')
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    // .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ in hoa')
    // .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
    // .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const { mutateAsync: changePassword } = useChangePassword()

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as ChangePasswordForm,
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await changePassword(value)
        navigate({ to: '/patient/profile' })
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error)
      }
    },
  })

  return (
    <div className="px-4">
      <ChildPageHeader
        title="Đổi mật khẩu"
        onBack={() => navigate({ to: '/patient/profile' })}
      />

      <main className="space-y-3 lg:mx-auto lg:max-w-3/4 lg:rounded-2xl lg:border lg:border-gray-200 lg:bg-white lg:p-6 lg:shadow xl:max-w-2/3">
        <div className="flex justify-center py-3">
          <div className="flex size-22 shrink-0 items-center justify-center rounded-full bg-teal-100/50">
            <span className="material-symbols-outlined text-teal-primary text-5xl!">
              lock_reset
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-3 pb-23 md:pb-11 lg:pb-0">
          <form.Field
            name="currentPassword"
            children={(field) => (
              <InputField
                label="Mật khẩu hiện tại"
                leftIcon={LockKeyhole}
                placeholder="Nhập mật khẩu hiện tại"
                field={field}
                type="password"
                className="h-12"
              />
            )}
          />

          <form.Field
            name="newPassword"
            children={(field) => (
              <InputField
                label="Mật khẩu mới"
                leftIcon={LockKeyholeOpen}
                placeholder="Nhập mật khẩu mới"
                field={field}
                type="password"
                className="h-12"
              />
            )}
          />

          <form.Field
            name="confirmPassword"
            children={(field) => (
              <InputField
                label="Xác nhận mật khẩu"
                leftIcon={CircleCheck}
                placeholder="Nhập lại mật khẩu mới"
                field={field}
                type="password"
                className="h-12"
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
                  <Save className="size-5.5" strokeWidth="2.5" />
                  {isSubmitting ? 'Đang lưu...' : ' Lưu thay đổi'}
                </Button>
              )}
            />
          </div>
        </form>
      </main>
    </div>
  )
}
