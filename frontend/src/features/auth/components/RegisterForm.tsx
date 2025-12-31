import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { CheckCircle, Loader2, Lock, Mail, Phone, User } from 'lucide-react'

import { registerBaseSchema, registerSchema } from '../schemas'
import type { RegisterFormData } from '../schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FieldInfo } from '@/components/FieldInfo'

import { apiClient } from '@/lib/axios'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const [globalError, setGlobalError] = useState('')

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    } as RegisterFormData,

    // KHÔNG DÙNG ADAPTER NỮA
    // Thay vào đó, ta định nghĩa validators thủ công hoặc dùng helper
    validators: {
      // Validate toàn bộ form (nếu cần check chéo password)
      onChange: ({ value }) => {
        const result = registerSchema.safeParse(value)
        if (result.success) return undefined

        // Trả về object lỗi { fieldName: errorMessage }
        // Lưu ý: TanStack Form mong đợi lỗi dạng string hoặc object map
        const errors = result.error.flatten().fieldErrors

        // Chuyển đổi định dạng lỗi của Zod sang định dạng TanStack Form mong đợi
        // Với form level validation, ta trả về lỗi cho từng field
        return Object.keys(errors).reduce(
          (acc, key) => {
            acc[key] = errors[key]?.[0] // Lấy lỗi đầu tiên
            return acc
          },
          {} as Record<string, string>,
        )
      },
      // Hoặc validate từng field (Standard Schema way nếu hỗ trợ)
      // Hiện tại cách manual safeParse là an toàn nhất khi bỏ adapter
    },

    onSubmit: async ({ value }) => {
      setGlobalError('')
      try {
        const { confirmPassword, ...payload } = value

        await apiClient.post('/auth/register', payload)

        alert('Đăng ký thành công! Vui lòng đăng nhập.')
        navigate({ to: '/login' })
      } catch (err: any) {
        const msg = err.response?.data?.error?.message || 'Đăng ký thất bại'
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
        name="fullName"
        // Validate riêng từng field nếu muốn (thay vì validate toàn bộ form ở trên)
        validators={{
          onChange: ({ value }) => {
            const result = registerBaseSchema.shape.fullName.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Họ và tên</Label>
            <div className="relative">
              <User className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="pl-10"
              />
            </div>
            <FieldInfo field={field} />
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = registerBaseSchema.shape.email.safeParse(value)
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
                  placeholder="email@vidu.com"
                  className="pl-10"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />

        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              const result = registerBaseSchema.shape.phone.safeParse(value)
              return result.success ? undefined : result.error.issues[0].message
            },
          }}
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Số điện thoại</Label>
              <div className="relative">
                <Phone className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="09xx..."
                  className="pl-10"
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            const result = registerBaseSchema.shape.password.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          },
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="pl-10"
              />
            </div>
            <FieldInfo field={field} />
          </div>
        )}
      />

      <form.Field
        name="confirmPassword"
        // Với confirmPassword, ta cần validate chéo (cross-field),
        // tốt nhất là dùng validator ở level form (như đã comment ở trên useForm)
        // hoặc check thủ công ở đây.
        validators={{
          onChange: ({ value, field }) => {
            // Check basic constraints
            const result =
              registerBaseSchema.shape.confirmPassword.safeParse(value)
            if (!result.success) return result.error.issues[0].message

            // Check khớp password
            // Note: field.form.getFieldValue('password') để lấy giá trị field khác
            if (value !== field.form.getFieldValue('password')) {
              return 'Mật khẩu nhập lại không khớp'
            }
            return undefined
          },
          // Re-validate khi password thay đổi
          onChangeListenTo: ['password'],
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Nhập lại mật khẩu</Label>
            <div className="relative">
              <CheckCircle className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng
                  ký...
                </>
              ) : (
                'Đăng ký tài khoản'
              )}
            </Button>
          )}
        />
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          className="font-bold text-teal-600 hover:text-teal-700 hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  )
}
