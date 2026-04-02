import { useNavigate, useParams } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AttachmentsSection,
  ClinicalInfoSection,
  PrescriptionTableSection,
  RecordDoctorCard,
} from '@/features/patient/components/medicalRecords'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { useGetRecordById } from '@/features/patient/hooks/useRecordQueries'
import Loader from '@/components/Loader'

export const RecordDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/patient/records/$recordId' })
  const recordId = params.recordId ? parseInt(params.recordId) : 0

  const { data: record, isLoading, error } = useGetRecordById(recordId)

  const handleBack = () => {
    navigate({ to: '/patient/records' })
  }

  const attachments = record?.medicalAttachments ?? []

  if (isLoading) return <Loader />

  if (error || !record) {
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
    <div className="px-4">
      <ChildPageHeader title="Chi tiết hồ sơ" onBack={handleBack} />

      <div className="space-y-3 pb-25 md:space-y-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:space-y-0">
        {/* Title row — col-span-2 */}
        <div className="flex items-center justify-between lg:col-span-12">
          <h2 className="text-3xl leading-tight font-bold">
            {record.diagnosis}
          </h2>

          <Button
            variant="teal_primary"
            className="hidden h-12 rounded-full text-base font-bold active:scale-[0.98] lg:inline-flex">
            <Download className="size-5" strokeWidth="2.5" />
            <span>Tải xuống đơn thuốc</span>
          </Button>
        </div>

        {/* Mobile: 1st │ Desktop: col 1, row 2 */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <RecordDoctorCard record={record} />
        </div>

        {/* Mobile: 2nd │ Desktop: col 2, rows 2-4 (full height) */}
        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-2 lg:self-stretch">
          <ClinicalInfoSection record={record} />
        </div>

        {/* Mobile: 3rd │ Desktop: col 1, row 3 */}
        {record.prescription && (
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

      {/* Floating Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-gray-100 bg-white p-4 md:left-20 lg:hidden">
        <Button
          variant="teal_primary"
          className="h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
          <Download className="size-5" strokeWidth="2.5" />
          <span>Tải xuống đơn thuốc</span>
        </Button>
      </div>
    </div>
  )
}
