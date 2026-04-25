import { createFileRoute } from '@tanstack/react-router'

import { PatientLayout } from '@/components/layouts/patient'
import { requireAuth } from '@/lib/route-guards'

export const Route = createFileRoute('/patient')({
  beforeLoad: (opts) =>
    requireAuth({ location: opts.location, roles: ['patient'] }),
  component: PatientLayout,
})
