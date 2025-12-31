import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/doctor/pages/SettingsPage'

export const Route = createFileRoute('/doctor/settings')({ component: SettingsPage })
