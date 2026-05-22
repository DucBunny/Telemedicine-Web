import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { AlertsPage } from '@/pages/doctor/AlertsPage'

const alertsSearchSchema = z.object({
  status: z.enum(['pending', 'handling', 'resolved']).optional(),
})

export const Route = createFileRoute('/doctor/alerts')({
  validateSearch: alertsSearchSchema,
  component: AlertsPage,
})
