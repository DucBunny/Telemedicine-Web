import { useForm } from '@tanstack/react-form'
import { Lock, Mail } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { loginSchema } from '../schemas'
import { useLoginMutation } from '../hooks/useAuthMutations'
import type { LoginFormData } from '../schemas'
import { InputField } from '@/components/InputField'
import { Button } from '@/components/ui/button'

export const LoginForm = () => {
  const loginMutation = useLoginMutation()
  const navigate = useNavigate({ from: '/login' })

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } as LoginFormData,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value)
        toast.success('Đăng nhập thành công!')
        navigate({ to: '/' })
      } catch (error) {
        toast.error('Đăng nhập thất bại')
        console.error(error)
      }
    },
  })

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Chào mừng trở lại!
        </h1>
        <p className="text-gray-500">
          Vui lòng đăng nhập để tiếp tục theo dõi sức khỏe.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
        <form.Field
          name="username"
          children={(field) => (
            <InputField
              label="Email hoặc Số điện thoại"
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              icon={Mail}
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
              placeholder="••••••••"
              icon={Lock}
              field={field}
            />
          )}
        />

        <div className="mb-6 flex items-center justify-end">
          <Link
            to="/"
            className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700">
            Quên mật khẩu?
          </Link>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || loginMutation.isPending}
              className={`w-full rounded-xl bg-teal-600 font-bold shadow-md shadow-teal-200 transition-colors ${
                !canSubmit
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-teal-700'
              }`}>
              {isSubmitting || loginMutation.isPending
                ? 'Đang xử lý...'
                : 'Đăng nhập'}
            </Button>
          )}
        />
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link
            to="/register"
            className="font-bold text-teal-600 transition-colors hover:text-teal-700">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
