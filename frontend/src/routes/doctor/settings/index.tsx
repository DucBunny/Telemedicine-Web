import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '@/pages/doctor/SettingsPage'

export const Route = createFileRoute('/doctor/settings/')({
  component: SettingsPage,
})
