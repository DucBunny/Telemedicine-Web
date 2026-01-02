import { z } from 'zod'

const email = z
  .string()
  .min(1, 'Vui lòng nhập email')
  .email('Email không hợp lệ')
const password = z
  .string()
  .min(1, 'Vui lòng nhập mật khẩu')
  .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
const fullName = z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự')
const phoneNumber = z
  .string()
  .min(1, 'Vui lòng nhập số điện thoại')
  .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ')

const username = z
  .string()
  .min(1, 'Vui lòng nhập email hoặc số điện thoại')
  .refine(
    (val) => email.safeParse(val).success || phoneNumber.safeParse(val).success,
    'Email hoặc số điện thoại không hợp lệ',
  )

export const loginSchema = z.object({
  username,
  password,
})

export const registerSchema = z
  .object({
    fullName,
    email,
    phoneNumber,
    password,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
