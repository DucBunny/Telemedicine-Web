import { useForm } from '@tanstack/react-form'
import {
  CircleAlert,
  LockKeyhole,
  Mail,
  Phone,
  User,
  UserRoundCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { RegisterFormData } from '@/features/auth/schemas'
import { FieldError } from '@/components/form/FieldError'
import { registerSchema } from '@/features/auth/schemas'
import { useRegisterMutation } from '@/features/auth/hooks/useAuthMutations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { InputField } from '@/components/form/InputField'
import { getErrorMessage } from '@/lib/axios'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const registerMutation = useRegisterMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      terms: false,
    } as RegisterFormData,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await registerMutation.mutateAsync(value)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        setFormError(errorMessage)
      }
    },
  })

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col md:max-w-none lg:max-w-md">
      <div className="mt-2 mb-6 text-center">
        <div className="text-teal-primary mb-4 inline-flex size-16 items-center justify-center rounded-full bg-teal-100/50 lg:hidden">
          <UserRoundCheck strokeWidth="2.5" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">
          Tạo tài khoản mới
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Điền thông tin để bắt đầu sử dụng dịch vụ
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="w-full flex-1 space-y-6">
        {/* Error message */}
        {formError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            <CircleAlert className="size-5" />
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <div className="flex flex-col justify-evenly gap-3 md:flex-row md:gap-4 lg:flex-col">
          <div className="max-w-md flex-1 space-y-3 md:space-y-4">
            <form.Field
              name="fullName"
              children={(field) => (
                <InputField
                  label="Họ và tên"
                  leftIcon={User}
                  placeholder="Nhập họ và tên"
                  field={field}
                  onChange={() => setFormError(null)}
                  className="h-12"
                />
              )}
            />
            <form.Field
              name="email"
              children={(field) => (
                <InputField
                  label="Email"
                  leftIcon={Mail}
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  field={field}
                  onChange={() => setFormError(null)}
                  className="h-12"
                />
              )}
            />
            <form.Field
              name="phoneNumber"
              children={(field) => (
                <InputField
                  label="Số điện thoại"
                  leftIcon={Phone}
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  field={field}
                  onChange={() => setFormError(null)}
                  className="h-12"
                />
              )}
            />
          </div>

          <div className="max-w-md flex-1 space-y-3 md:space-y-4">
            <form.Field
              name="password"
              children={(field) => (
                <InputField
                  label="Mật khẩu"
                  leftIcon={LockKeyhole}
                  placeholder="Tạo mật khẩu"
                  type="password"
                  field={field}
                  onChange={() => setFormError(null)}
                  className="h-12"
                />
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <InputField
                  label="Xác nhận mật khẩu"
                  leftIcon="lock_reset"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  field={field}
                  onChange={() => setFormError(null)}
                  className="h-12"
                />
              )}
            />
          </div>
        </div>

        {/* Nút Checkbox & Submit */}
        <div className="space-y-6 md:pt-6 lg:pt-0">
          <form.Field
            name="terms"
            children={(field) => (
              <div className="text-center">
                <label className="mt-2 flex cursor-pointer items-center justify-center">
                  <Checkbox
                    className="data-[state=checked]:border-teal-primary data-[state=checked]:bg-teal-primary border-gray-300"
                    checked={field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked === true)
                      setFormError(null)
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Tôi đồng ý với{' '}
                    <a
                      href="#"
                      className="text-teal-primary hover:text-teal-primary-foreground hover:underline">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a
                      href="#"
                      className="text-teal-primary hover:text-teal-primary-foreground hover:underline">
                      Chính sách bảo mật
                    </a>
                  </span>
                </label>
                <FieldError field={field} />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                variant="teal_primary"
                type="submit"
                disabled={!canSubmit || registerMutation.isPending}
                className={`mx-auto flex h-14 w-full max-w-md rounded-xl text-lg! font-bold hover:-translate-y-0.5 ${
                  !canSubmit ? 'cursor-not-allowed opacity-50' : ''
                }`}>
                {isSubmitting || registerMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Đăng ký'}
              </Button>
            )}
          />
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-base text-slate-500">
          Đã có tài khoản?{' '}
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate({ to: '/login' })}
            className="text-teal-primary p-0 text-base! font-bold">
            Đăng nhập ngay
          </Button>
        </p>
      </div>
    </div>
  )
}
