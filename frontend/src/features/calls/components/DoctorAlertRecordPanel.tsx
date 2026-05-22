import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import type { Alert } from '@/features/alerts/types'

import { useResolveAlert } from '@/features/alerts/hooks/useAlertQueries'
import { TextAreaField } from '@/components/form/TextAreaField'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatLongDate, formatTime } from '@/lib/format-date'

export interface DoctorAlertRecordPanelProps {
  alert: Alert
}

const alertRecordFormSchema = z.object({
  symptoms: z.string().trim().min(1, 'Vui lòng nhập triệu chứng'),
  diagnosis: z.string().trim().min(1, 'Vui lòng nhập chẩn đoán'),
  treatmentPlan: z.string(),
  notes: z.string(),
})

type AlertRecordFormData = z.infer<typeof alertRecordFormSchema>

export function DoctorAlertRecordPanel({ alert }: DoctorAlertRecordPanelProps) {
  const { mutateAsync: resolveAlert, isPending } = useResolveAlert()

  const form = useForm({
    defaultValues: {
      symptoms: alert.message,
      diagnosis: '',
      treatmentPlan: '',
      notes: '',
    } as AlertRecordFormData,
    validators: {
      onSubmit: alertRecordFormSchema,
    },
    onSubmit: async ({ value }) => {
      await resolveAlert({ alertId: alert.id, payload: value })
    },
  })

  return (
    <ScrollArea className="h-[30vh] overflow-hidden bg-white md:h-auto">
      <form
        className="space-y-3 px-1 pb-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
        <div className="space-y-1">
          <p className="text-lg font-semibold">Cảnh báo #{alert.id}</p>
          <p className="text-teal-primary text-sm">
            {formatLongDate(alert.createdAt)} · {formatTime(alert.createdAt)}
          </p>
          <p className="text-sm text-slate-700">{alert.message}</p>
        </div>

        <form.Field name="symptoms">
          {(field) => (
            <TextAreaField
              field={field}
              label="Triệu chứng *"
              placeholder="Triệu chứng chính..."
              rows={3}
            />
          )}
        </form.Field>

        <form.Field name="diagnosis">
          {(field) => (
            <TextAreaField
              field={field}
              label="Chẩn đoán *"
              placeholder="Chẩn đoán..."
              rows={3}
            />
          )}
        </form.Field>

        <form.Field name="treatmentPlan">
          {(field) => (
            <TextAreaField field={field} label="Phương án điều trị" rows={3} />
          )}
        </form.Field>

        <form.Field name="notes">
          {(field) => <TextAreaField field={field} label="Ghi chú" rows={2} />}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="teal_primary"
              className="mt-3 w-full"
              disabled={!canSubmit || isPending || isSubmitting}>
              Chốt ca & lưu bệnh án
            </Button>
          )}
        </form.Subscribe>
      </form>
    </ScrollArea>
  )
}
