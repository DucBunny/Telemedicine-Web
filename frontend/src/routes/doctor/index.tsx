import { createFileRoute } from '@tanstack/react-router'
import DoctorPortal from '../../features/doctor/DoctorPortal'

export const Route = createFileRoute('/doctor/')({
  component: DoctorPortal,
})
