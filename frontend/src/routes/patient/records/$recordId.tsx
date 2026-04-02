import { createFileRoute } from '@tanstack/react-router'
import { RecordDetailPage } from '@/features/patient/pages/records/RecordDetailPage'
import { recordApi } from '@/features/patient/api/record.api'
import { RECORD_KEYS } from '@/features/patient/hooks/useRecordQueries'

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
