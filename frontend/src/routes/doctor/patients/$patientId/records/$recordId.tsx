import { createFileRoute } from '@tanstack/react-router'

import { recordApi } from '@/features/medicalRecords/api/record.api'
import { RECORD_KEYS } from '@/features/medicalRecords/hooks/useRecordQueries'
import { RecordDetailPage } from '@/pages/doctor/patients/RecordDetailPage'

export const Route = createFileRoute(
  '/doctor/patients/$patientId/records/$recordId',
)({
  component: RecordDetailPage,
  staticData: {
    title: 'Chi tiết hồ sơ',
    hideMobileNav: true,
    hideHeader: true,
  },
  loader: async ({ params, context: { queryClient } }) => {
    const recordId = parseInt(params.recordId, 10)
    await queryClient.ensureQueryData({
      queryKey: RECORD_KEYS.detail(recordId),
      queryFn: () => recordApi.getRecordById(recordId),
    })
  },
})
