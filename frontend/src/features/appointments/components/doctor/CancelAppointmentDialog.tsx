import { CancelAppointmentDialogBase } from '@/features/appointments/components/common/CancelAppointmentDialogBase'

interface CancelAppointmentDialogProps {
  appointmentId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const DOCTOR_CANCEL_REASONS = [
  {
    id: 'emergency-case',
    label: 'Có ca cấp cứu',
    value: 'Có ca cấp cứu',
  },
  {
    id: 'reschedule-shift',
    label: 'Thay đổi lịch làm việc',
    value: 'Thay đổi lịch làm việc',
  },
  {
    id: 'patient-no-show',
    label: 'Bệnh nhân không đến',
    value: 'Bệnh nhân không đến',
  },
  {
    id: 'other',
    label: 'Khác',
    value: 'OTHER',
  },
] as const

export const CancelAppointmentDialog = ({
  appointmentId,
  isOpen,
  onOpenChange,
}: CancelAppointmentDialogProps) => {
  return (
    <CancelAppointmentDialogBase
      appointmentId={appointmentId}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      reasons={DOCTOR_CANCEL_REASONS}
      title="Lý do hủy lịch?"
      description="Hãy cho bệnh nhân biết lý do bạn hủy lịch hẹn này."
      submitLabel="Hủy lịch"
      keepLabel="Giữ lại"
    />
  )
}
