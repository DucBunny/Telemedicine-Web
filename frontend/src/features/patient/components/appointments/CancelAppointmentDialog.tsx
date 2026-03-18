import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export interface CancelReasonData {
  reason: string
  note: string
}

interface CancelAppointmentDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const CANCEL_REASONS = [
  { id: 'busy', label: 'Bận việc đột xuất', value: 'Bận việc đột xuất' },
  { id: 'change-plan', label: 'Thay đổi kế hoạch', value: 'Thay đổi kế hoạch' },
  { id: 'other-doctor', label: 'Chọn bác sĩ khác', value: 'Chọn bác sĩ khác' },
  { id: 'other', label: 'Khác', value: 'OTHER' },
]

const cancelFormSchema = z
  .object({
    reason: z.string().min(1, 'Vui lòng chọn lý do hủy'),
    note: z.string(),
  })
  .refine(
    (data) => {
      // Nếu chọn "Khác" (OTHER), note phải có giá trị
      if (data.reason === 'OTHER') {
        return data.note.trim().length > 0
      }
      return true
    },
    {
      message: 'Vui lòng nhập lý do hủy',
      path: ['note'],
    },
  )

export const CancelAppointmentDialog = ({
  isOpen,
  onOpenChange,
}: CancelAppointmentDialogProps) => {
  const form = useForm({
    defaultValues: {
      reason: '',
      note: '',
    } as CancelReasonData,
    validators: {
      onChange: cancelFormSchema,
    },
    onSubmit: ({ value }) => {
      // Nếu chọn "Khác", dùng note làm reason
      const finalData =
        value.reason === 'OTHER'
          ? { reason: value.note, note: '' }
          : { reason: value.reason, note: value.note }
      // TODO: Gọi API để hủy lịch hẹn với finalData
      // onConfirmCancel(finalData)
      form.reset()
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-3xl bg-white p-6"
        showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Lý do hủy lịch?
          </DialogTitle>
          <DialogDescription className="px-4 text-center text-sm">
            Hãy cho chúng tôi biết lý do bạn muốn hủy lịch hẹn này để chúng tôi
            hỗ trợ tốt hơn.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}>
          {/* Radio Buttons với TanStack Form */}
          <form.Field name="reason">
            {(field) => (
              <RadioGroup
                value={field.state.value}
                onValueChange={field.handleChange}>
                {CANCEL_REASONS.map((reason) => {
                  const isChecked = field.state.value === reason.value
                  return (
                    <Label
                      key={reason.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
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
            )}
          </form.Field>

          {/* Textarea - Chỉ hiện khi chọn "Khác" */}
          <form.Field name="reason">
            {(field) =>
              field.state.value === 'OTHER' && (
                <form.Field name="note">
                  {(noteField) => (
                    <textarea
                      name={noteField.name}
                      value={noteField.state.value}
                      onChange={(e) => noteField.handleChange(e.target.value)}
                      onBlur={noteField.handleBlur}
                      className="w-full rounded-xl border border-gray-400 bg-gray-50 p-3 text-sm placeholder:text-gray-400"
                      placeholder="Nhập lý do hủy..."
                      rows={3}
                    />
                  )}
                </form.Field>
              )
            }
          </form.Field>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isSubmitting}
                  variant="red_blur"
                  className="flex-1 rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  Hủy lịch
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="button"
              size="lg"
              onClick={() => onOpenChange(false)}
              variant="teal_primary"
              className="flex-1 rounded-xl text-sm">
              Giữ lại
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
