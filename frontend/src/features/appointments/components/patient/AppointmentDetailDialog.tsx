import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'

import type { Appointment } from '@/features/appointments/types'

import { AppointmentDetailDialogBase } from '@/features/appointments/components/common/AppointmentDetailDialogBase'
import { SpecialtyPickerDialog } from '@/features/appointments/components/patient'
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
  const isCancelled = appointment?.status === 'cancelled'

  const [bookingOpen, setBookingOpen] = useState(false)
  const handleCreateNewAppointment = () => {
    setBookingOpen(true)
    onOpenChange(false)
  }

  return (
    <>
      <AppointmentDetailDialogBase
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        appointment={appointment}
        role="patient"
        footer={
          <>
            {isCancelled && (
              <Button
                variant="teal_primary"
                size="lg"
                onClick={handleCreateNewAppointment}
                className="w-full rounded-full text-sm active:scale-[0.98]">
                <CalendarPlus />
                Đặt lịch mới
              </Button>
            )}
            <Button
              variant={isCancelled ? 'outline' : 'teal_primary'}
              size="lg"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full text-sm active:scale-[0.98]">
              Đóng
            </Button>
          </>
        }
      />

      <SpecialtyPickerDialog
        isOpen={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </>
  )
}
