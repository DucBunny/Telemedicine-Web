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
  .regex(/^[0-9]{10,11}$/, 'Phone number is not valid (10-11 digits)')
  .min(1, 'Phone number is required')

export const registerSchema = z.object({
  email,
  password,
  fullName,
  phoneNumber
})

export const loginSchema = z.object({
  email,
  password
})
