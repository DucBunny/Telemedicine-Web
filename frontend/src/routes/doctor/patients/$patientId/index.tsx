import { createFileRoute } from '@tanstack/react-router'

import { PatientDetailPage } from '@/pages/doctor/patients/PatientDetailPage'

export const Route = createFileRoute('/doctor/patients/$patientId/')({
  component: PatientDetailPage,
  staticData: {
    title: 'Chi tiết bệnh nhân',
  },
})
