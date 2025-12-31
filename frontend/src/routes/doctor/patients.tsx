import { createFileRoute } from '@tanstack/react-router'
import { PatientsPage } from '@/features/doctor/pages/PatientsPage'

export const Route = createFileRoute('/doctor/patients')({ component: PatientsPage })
