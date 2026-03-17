import { useForm } from '@tanstack/react-form'
import { LockKeyhole, SquarePlus, User } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { LoginFormData } from '@/features/auth/schemas'
import { loginSchema } from '@/features/auth/schemas'
import { useLoginMutation } from '@/features/auth/hooks/useAuthMutations'
import { InputField } from '@/components/form/InputField'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/axios'

export const LoginForm = () => {
  const navigate = useNavigate()
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
    <div className="mx-auto w-full max-w-md lg:my-auto">
      <div className="mt-2 mb-6 text-center">
        <div className="text-teal-primary mb-4 inline-flex size-16 items-center justify-center rounded-full bg-teal-100/50 lg:hidden">
          <SquarePlus strokeWidth="2.5" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100">
          Chào mừng trở lại
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Vui lòng đăng nhập để quản lý hồ sơ sức khỏe
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex-1 space-y-4">
        <form.Field
          name="username"
          children={(field) => (
            <InputField
              label="Tài khoản"
              leftIcon={User}
              placeholder="Nhập email hoặc số điện thoại"
              field={field}
              onChange={() => setFormError(null)}
              className="h-12"
            />
          )}
        />

        <div>
          <form.Field
            name="password"
            children={(field) => (
              <InputField
                label="Mật khẩu"
                leftIcon={LockKeyhole}
                placeholder="••••••••"
                type="password"
                field={field}
                onChange={() => setFormError(null)}
                className="h-12"
              />
            )}
          />

          {formError && (
            <p className="mt-1 text-sm text-red-600">{formError}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/"
            className="text-teal-primary text-sm font-medium transition-colors hover:text-teal-700 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <div className="pt-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="teal_primary"
                disabled={!canSubmit || loginMutation.isPending}
                className={`h-14 w-full rounded-xl text-lg! font-bold hover:-translate-y-0.5 ${
                  !canSubmit ? 'cursor-not-allowed opacity-50' : ''
                }`}>
                {isSubmitting || loginMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Đăng nhập'}
              </Button>
            )}
          />
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-center">
        <p className="text-base text-slate-500">
          Chưa có tài khoản?{' '}
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate({ to: '/register' })}
            className="text-teal-primary p-0 text-base! font-bold">
            Đăng ký ngay
          </Button>
        </p>
      </div>
    </div>
  )
}
