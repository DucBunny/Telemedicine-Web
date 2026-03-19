import { useNavigate } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AdviceSection,
  DiagnosisSection,
  PrescriptionSection,
  RecordDoctorCard,
  RecordTitleHeader,
} from '@/features/patient/components/medicalRecords'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import {
  MOCK_ADVICES,
  MOCK_DIAGNOSIS,
  MOCK_DOCTOR,
  MOCK_MEDICATIONS,
  MOCK_RECORD,
} from '@/features/patient/data/recordsMockData'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'

export const RecordDetailPage = () => {
  useHideMobileNav()

  const navigate = useNavigate()

  const handleBack = () => {
    navigate({ to: '/patient/records' })
  }

  return (
    <div className="px-4">
      <ChildPageHeader title="Chi tiết hồ sơ" onBack={handleBack} />

      <div className="space-y-3 pb-25 md:space-y-6 lg:grid lg:grid-cols-12 lg:gap-4 lg:space-y-0">
        <div className="flex items-center justify-between lg:col-span-12">
          <RecordTitleHeader record={MOCK_RECORD} />

          <Button
            variant="teal_primary"
            className="hidden h-12 rounded-full text-base font-bold active:scale-[0.98] lg:inline-flex">
            <>
              <Download className="size-5" strokeWidth="2.5" />
              <span>Tải xuống đơn thuốc</span>
            </>
          </Button>
        </div>
        <div className="lg:col-span-5">
          <RecordDoctorCard doctor={MOCK_DOCTOR} record={MOCK_RECORD} />
        </div>
        <div className="lg:col-span-7">
          <DiagnosisSection diagnosis={MOCK_DIAGNOSIS} />
        </div>
        <div className="lg:col-span-6">
          <PrescriptionSection medications={MOCK_MEDICATIONS} />
        </div>
        <div className="lg:col-span-6">
          <AdviceSection advices={MOCK_ADVICES} />
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-gray-100 bg-white p-4 md:left-20 lg:hidden">
        <Button
          variant="teal_primary"
          className="h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
          <>
            <Download className="size-5" strokeWidth="2.5" />
            <span>Tải xuống đơn thuốc</span>
          </>
        </Button>
      </div>
    </div>
  )
}
