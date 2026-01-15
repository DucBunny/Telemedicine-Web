import { useForm } from '@tanstack/react-form'
import { Lock, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { loginSchema } from '../schemas'
import { useLoginMutation } from '../hooks/useAuthMutations'
import type { LoginFormData } from '../schemas'
import { InputField } from '@/components/InputField'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/axios'

export const LoginForm = () => {
  const loginMutation = useLoginMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    } as LoginFormData,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        await loginMutation.mutateAsync(value)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        setFormError(errorMessage)
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
        }}
        className="space-y-4">
        <form.Field
          name="username"
          children={(field) => (
            <InputField
              label="Email hoặc Số điện thoại"
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              icon={Mail}
              field={field}
              onChange={() => setFormError(null)}
            />
          )}
        />

        <div>
          <form.Field
            name="password"
            children={(field) => (
              <InputField
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                field={field}
                onChange={() => setFormError(null)}
              />
            )}
          />

          {formError && (
            <p className="mt-1 text-sm text-red-600">{formError}</p>
          )}
        </div>

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
              variant="teal_primary"
              disabled={!canSubmit || loginMutation.isPending}
              className={`w-full rounded-xl font-bold shadow-md shadow-teal-200 transition-colors ${
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
