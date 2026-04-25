import type { Appointment } from '@/features/appointments/types'

import { AppointmentDetailDialogBase } from '@/features/appointments/components/common/AppointmentDetailDialogBase'
import { Button } from '@/components/ui/button'

interface AppointmentDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
}

export const AppointmentDetailDialog = ({
  isOpen,
  onOpenChange,
  appointment,
}: AppointmentDetailDialogProps) => {
  return (
    <AppointmentDetailDialogBase
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      appointment={appointment}
      role="doctor"
      footer={
        <Button
          variant="teal_primary"
          size="lg"
          onClick={() => onOpenChange(false)}
          className="w-full rounded-full text-sm active:scale-[0.98]">
          Đóng
        </Button>
      }
    />
  )
}
