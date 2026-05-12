import { useNavigate, useParams } from '@tanstack/react-router'

import { RecordPatientCard } from '@/features/medicalRecords/components/doctor'
import {
  AttachmentsSection,
  ClinicalInfoSection,
  PrescriptionTableSection,
} from '@/features/medicalRecords/components/patient'
import { useGetRecordById } from '@/features/medicalRecords/hooks/useRecordQueries'
import Loader from '@/components/common/Loader'
import { ChildPageHeader } from '@/components/common/PageHeader'

export const RecordDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({
    from: '/doctor/patients/$patientId/records/$recordId',
  })
  const recordId = params.recordId ? Number.parseInt(params.recordId, 10) : 0
  const patientId = params.patientId

  const { data: record, isLoading, isError } = useGetRecordById(recordId)

  const handleBack = () => {
    navigate({
      to: '/doctor/patients/$patientId',
      params: { patientId },
    })
  }

  const attachments = record?.medicalAttachments ?? []

  if (isLoading) return <Loader />

  if (isError || !record) {
    return (
      <div className="px-4">
        <ChildPageHeader title="Chi tiết hồ sơ" onBack={handleBack} />
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Không thể tải chi tiết hồ sơ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:p-0">
      <ChildPageHeader
        title="Chi tiết hồ sơ"
        onBack={handleBack}
        className="lg:hidden"
      />

      <div className="space-y-3 pb-4 md:space-y-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:space-y-0">
        <div className="flex items-center justify-between lg:col-span-12">
          <h2 className="text-3xl leading-tight font-bold">
            {record.diagnosis}
          </h2>
        </div>

        {/* Mobile: 1st │ Desktop: col 1, row 2 */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <RecordPatientCard record={record} />
        </div>

        {/* Mobile: 2nd │ Desktop: col 2, rows 2-4 (full height) */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-2 lg:self-stretch">
          <ClinicalInfoSection record={record} />
        </div>

        {/* Mobile: 3rd │ Desktop: col 1, row 3 */}
        {record.prescription && record.prescription.length > 0 && (
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-3">
            <PrescriptionTableSection prescription={record.prescription} />
          </div>
        )}

        {/* Mobile: 4th │ Desktop: col 1, row 4 */}
        {attachments.length > 0 && (
          <div className="lg:col-span-7 lg:col-start-1 lg:row-start-4">
            <AttachmentsSection attachments={attachments} />
          </div>
        )}
      </div>
    </div>
  )
}
