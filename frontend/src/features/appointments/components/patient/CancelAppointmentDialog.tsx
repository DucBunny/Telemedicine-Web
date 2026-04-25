import { CancelAppointmentDialogBase } from '@/features/appointments/components/common/CancelAppointmentDialogBase'

interface CancelAppointmentDialogProps {
  appointmentId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const PATIENT_CANCEL_REASONS = [
  {
    id: 'busy',
    label: 'Bận việc đột xuất',
    value: 'Bận việc đột xuất',
  },
  {
    id: 'change-plan',
    label: 'Thay đổi kế hoạch',
    value: 'Thay đổi kế hoạch',
  },
  {
    id: 'other-doctor',
    label: 'Chọn bác sĩ khác',
    value: 'Chọn bác sĩ khác',
  },
  {
    id: 'other',
    label: 'Khác',
    value: 'OTHER',
  },
] as const

export const CancelAppointmentDialog = ({
  isOpen,
  onOpenChange,
  appointmentId,
}: CancelAppointmentDialogProps) => {
  return (
    <CancelAppointmentDialogBase
      appointmentId={appointmentId}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      reasons={PATIENT_CANCEL_REASONS}
      title="Lý do hủy lịch?"
      description="Hãy cho chúng tôi biết lý do bạn muốn hủy lịch hẹn này để chúng tôi hỗ trợ tốt hơn."
      submitLabel="Hủy lịch"
      keepLabel="Giữ lại"
    />
  )
}
