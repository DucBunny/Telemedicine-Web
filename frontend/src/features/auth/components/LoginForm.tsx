import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { ArrowRight, Loader2, Lock, Mail } from 'lucide-react'
import { loginSchema } from '../schemas'
import type { LoginFormData } from '../schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FieldInfo } from '@/components/FieldInfo'
import { apiClient } from '@/lib/axios'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [globalError, setGlobalError] = useState('')

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,

    onSubmit: async ({ value }) => {
      setGlobalError('')
      try {
        const response = await apiClient.post('/auth/login', value)
        const { accessToken, refreshToken, user } = response.data.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))

        // Chuyển hướng
        navigate({ to: '/' }) // Sửa lại route thực tế
      } catch (err: any) {
        const msg = err.response?.data?.error?.message || 'Đăng nhập thất bại'
        setGlobalError(msg)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4">
      {globalError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          ⚠️ {globalError}
        </div>
      )}

      <form.Field
        name="email"
        // Validate thủ công dùng Zod safeParse
        validators={{
          onChange: ({ value }) => {
            const result = loginSchema.shape.email.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Email</Label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="bacsi@medcare.com"
                className="pl-10"
              />
            </div>
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="password"
        // Validate thủ công dùng Zod safeParse
        validators={{
          onChange: ({ value }) => {
            const result = loginSchema.shape.password.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>Mật khẩu</Label>
              <Link
                to="/"
                className="text-xs font-medium text-teal-600 hover:text-teal-700">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
            <FieldInfo field={field} />
          </div>
        )}
      />

      <div className="pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-11 w-full text-base shadow-lg shadow-teal-100">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử
                  lý...
                </>
              ) : (
                <>
                  Đăng nhập <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        />
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}
