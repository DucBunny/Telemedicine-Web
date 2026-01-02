import { z } from 'zod'

const email = z.email('Email is not valid').min(1, 'Email is required')
const password = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .min(1, 'Password is required')
const fullName = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .min(1, 'Full name is required')
const phoneNumber = z
  .string()
  .regex(
    /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
    'Phone number is not valid (10-11 digits)'
  )
  .min(1, 'Phone number is required')

const username = z
  .string()
  .min(1, 'Username is required')
  .refine(
    (val) => email.safeParse(val).success || phoneNumber.safeParse(val).success,
    'Email or phone number is not valid'
  )

export const loginSchema = z.object({
  username,
  password
})

export const registerSchema = z.object({
  email,
  password,
  fullName,
  phoneNumber
})
