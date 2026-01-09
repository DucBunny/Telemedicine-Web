import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

export const Route = createFileRoute('/(public)/register')({
  component: RegisterPage,
})
