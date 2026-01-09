import { useForm } from '@tanstack/react-form'
import { Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { registerSchema } from '../schemas'
import { useRegisterMutation } from '../hooks/useAuthMutations'
import type { RegisterFormData } from '../schemas'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { InputField } from '@/components/InputField'
import { FieldError } from '@/components/FieldError'

export const RegisterForm = () => {
  const registerMutation = useRegisterMutation()

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
      try {
        await registerMutation.mutateAsync(value)
        toast.success('Đăng ký thành công!')
      } catch (error) {
        toast.error('Đăng ký thất bại')
        console.error(error)
      }
    },
  })

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Tạo tài khoản mới
        </h1>
        <p className="text-gray-500">Điền thông tin bên dưới để đăng ký.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
        <form.Field
          name="fullName"
          children={(field) => (
            <InputField
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              icon={User}
              field={field}
            />
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <InputField
              label="Email"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
              field={field}
            />
          )}
        />

        <form.Field
          name="phoneNumber"
          children={(field) => (
            <InputField
              label="Số điện thoại"
              type="tel"
              placeholder="0912 345 678"
              icon={Phone}
              field={field}
            />
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <InputField
              label="Mật khẩu"
              type="password"
              placeholder="Tạo mật khẩu mạnh"
              icon={Lock}
              field={field}
            />
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <InputField
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              icon={ShieldCheck}
              field={field}
            />
          )}
        />

        <form.Field
          name="terms"
          children={(field) => (
            <>
              <label className="mt-2 flex cursor-pointer items-center">
                <Checkbox
                  className="border-gray-300 data-[state=checked]:border-teal-600 data-[state=checked]:bg-teal-600"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{' '}
                  <a
                    href="#"
                    className="text-teal-600 underline hover:text-teal-700">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a
                    href="#"
                    className="text-teal-600 underline hover:text-teal-700">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>

              <FieldError field={field} />
            </>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              size="lg"
              type="submit"
              disabled={!canSubmit || registerMutation.isPending}
              className={`mt-6 w-full rounded-xl bg-teal-600 font-bold shadow-md shadow-teal-200 transition-colors ${
                !canSubmit
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-teal-700'
              }`}>
              {isSubmitting || registerMutation.isPending
                ? 'Đang đăng ký...'
                : 'Đăng ký tài khoản'}
            </Button>
          )}
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-bold text-teal-600 transition-colors hover:text-teal-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
