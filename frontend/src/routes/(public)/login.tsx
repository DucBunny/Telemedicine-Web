import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginPage } from '@/features/auth/pages/LoginPage'

export const Route = createFileRoute('/(public)/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
})
