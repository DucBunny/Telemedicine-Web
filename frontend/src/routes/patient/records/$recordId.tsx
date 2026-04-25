import { createFileRoute } from '@tanstack/react-router'

import { recordApi } from '@/features/medicalRecords/api/record.api'
import { RECORD_KEYS } from '@/features/medicalRecords/hooks/useRecordQueries'
import { RecordDetailPage } from '@/pages/patient/records/RecordDetailPage'

export const Route = createFileRoute('/patient/records/$recordId')({
  component: RecordDetailPage,
  staticData: {
    hideMobileNav: true,
  },
  loader: async ({ params, context: { queryClient } }) => {
    const recordId = parseInt(params.recordId)
    // Prefetch record detail
    await queryClient.ensureQueryData({
      queryKey: RECORD_KEYS.detail(recordId),
      queryFn: () => recordApi.getRecordById(recordId),
    })
  },
})
