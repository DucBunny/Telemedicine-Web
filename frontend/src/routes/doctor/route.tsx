import { createFileRoute } from '@tanstack/react-router'

import { DoctorLayout } from '@/components/layouts/doctor'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/doctor')({
  beforeLoad: (opts) =>
    requireAuth({ location: opts.location, roles: ['doctor'] }),
  component: DoctorLayout,
})
