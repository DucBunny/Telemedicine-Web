import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { useCancelAppointment } from '@/features/appointments/hooks/useAppointmentQueries'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FieldError } from '@/components/form/FieldError'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export interface CancelReasonOption {
  id: string
  label: string
  value: string
}

interface CancelAppointmentDialogBaseProps {
  appointmentId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  reasons: ReadonlyArray<CancelReasonOption>
  title?: string
  description?: string
  submitLabel?: string
  keepLabel?: string
}

const OTHER_REASON_VALUE = 'OTHER'

const cancelFormSchema = z
  .object({
    reason: z.string().min(1, 'Vui lòng chọn lý do hủy'),
    note: z.string(),
  })
  .refine(
    (data) => {
      // Nếu chọn "Khác", bắt buộc phải nhập lý do hủy
      if (data.reason === OTHER_REASON_VALUE) {
        return data.note.trim().length > 0
      }
      return true
    },
    {
      message: 'Vui lòng nhập lý do hủy',
      path: ['note'],
    },
  )

type CancelFormData = z.infer<typeof cancelFormSchema>

export const CancelAppointmentDialogBase = ({
  appointmentId,
  isOpen,
  onOpenChange,
  reasons,
  title = 'Lý do hủy lịch?',
  description = 'Hãy cho chúng tôi biết lý do bạn muốn hủy lịch hẹn này để chúng tôi hỗ trợ tốt hơn.',
  submitLabel = 'Hủy lịch',
  keepLabel = 'Giữ lại',
}: CancelAppointmentDialogBaseProps) => {
  const { mutateAsync: cancelAppointment, isPending: isCancelPending } =
    useCancelAppointment()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      reason: '',
      note: '',
    } as CancelFormData,
    validators: {
      onMount: cancelFormSchema,
      onChange: cancelFormSchema,
    },
    onSubmit: async ({ value }) => {
      // Nếu chọn "Khác", sử dụng nội dung của trường note làm lý do hủy
      const cancelReason =
        value.reason === OTHER_REASON_VALUE ? value.note : value.reason

      try {
        await cancelAppointment({
          id: appointmentId,
          payload: { cancelReason },
        })
      } catch (error) {
        console.error('[Appointments] Cancel Appointment Error:', error)
        return
      }

      form.reset()
      onOpenChange(false)
    },
  })

  // Reset form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="scrollbar-hide max-h-[80vh] overflow-y-auto rounded-3xl bg-white p-6 lg:max-h-[90vh]"
          showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {title}
            </DialogTitle>
            <DialogDescription className="px-4 text-center text-sm">
              {description}
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}>
            <form.Field name="reason">
              {(field) => (
                <>
                  <RadioGroup
                    className="gap-2"
                    value={field.state.value}
                    onValueChange={field.handleChange}>
                    {reasons.map((reason) => {
                      const isChecked = field.state.value === reason.value

                      return (
                        <Label
                          key={reason.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3! transition-colors ${
                            isChecked
                              ? 'border-teal-primary bg-teal-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                          <RadioGroupItem value={reason.value} />
                          <span className="text-sm font-medium">
                            {reason.label}
                          </span>
                        </Label>
                      )
                    })}
                  </RadioGroup>
                  <FieldError field={field} />
                </>
              )}
            </form.Field>

            {/* Textarea for additional reason */}
            <form.Field name="reason">
              {(field) =>
                field.state.value === OTHER_REASON_VALUE && (
                  <form.Field name="note">
                    {(noteField) => (
                      <>
                        <textarea
                          name={noteField.name}
                          value={noteField.state.value}
                          onChange={(event) =>
                            noteField.handleChange(event.target.value)
                          }
                          onBlur={noteField.handleBlur}
                          className="focus-visible:ring-teal-primary border-input w-full rounded-xl border bg-gray-50 p-3 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none"
                          placeholder="Nhập lý do hủy..."
                          rows={3}
                        />
                        <FieldError field={noteField} />
                      </>
                    )}
                  </form.Field>
                )
              }
            </form.Field>

            {/* Action */}
            <div className="mt-6 flex gap-3">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="button"
                    size="lg"
                    disabled={!canSubmit || isCancelPending}
                    variant="red_blur"
                    className="flex-1 rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => {
                      if (!canSubmit) return
                      setIsDeleteDialogOpen(true)
                    }}>
                    {isSubmitting ? 'Đang xử lý...' : submitLabel}
                  </Button>
                )}
              </form.Subscribe>
              <Button
                type="button"
                size="lg"
                onClick={() => handleOpenChange(false)}
                variant="teal_primary"
                className="flex-1 rounded-xl text-sm">
                {keepLabel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          form.handleSubmit()
          setIsDeleteDialogOpen(false)
        }}
        title="Hủy lịch hẹn"
        description={`Bạn có chắc chắn muốn hủy lịch hẹn này không?`}
        cancelLabel={keepLabel}
        confirmLabel={submitLabel}
      />
    </>
  )
}
