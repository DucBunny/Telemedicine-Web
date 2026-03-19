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

      <div className="space-y-3 pb-25 md:space-y-6">
        <RecordTitleHeader record={MOCK_RECORD} />
        <RecordDoctorCard doctor={MOCK_DOCTOR} record={MOCK_RECORD} />
        <DiagnosisSection diagnosis={MOCK_DIAGNOSIS} />
        <PrescriptionSection medications={MOCK_MEDICATIONS} />
        <AdviceSection advices={MOCK_ADVICES} />
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-gray-100 bg-white p-4 md:left-20 lg:hidden">
        <Button
          variant="teal_primary"
          className="h-12 w-full rounded-full text-base font-bold active:scale-[0.98]">
          <>
            <Download className="size-5" strokeWidth="2.5" />
            <span>Tải xuống đơn thuốc</span>
          </>
        </Button>
      </div>
    </div>
  )
}
