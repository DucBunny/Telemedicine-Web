import { createFileRoute } from '@tanstack/react-router'
import { DevicesPage } from '@/features/admin/pages/DevicesPage'

export const Route = createFileRoute('/admin/devices')({
  component: DevicesPage,
})
