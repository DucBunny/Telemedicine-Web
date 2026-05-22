import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import type { Appointment } from '@/features/appointments/types'
import type { MedicalRecord } from '@/features/medicalRecords/types'

import {
  useCreateRecord,
  useUpdateRecord,
} from '@/features/medicalRecords/hooks/useRecordQueries'
import { TextAreaField } from '@/components/form/TextAreaField'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatLongDate, formatTime } from '@/lib/format-date'
import { selectUser, useAuthStore } from '@/stores/auth.store'

export interface DoctorVisitRecordPanelProps {
  appointment: Appointment | null
  patientUserId: number
  existingRecord: MedicalRecord | undefined
}

const visitRecordFormSchema = z.object({
  symptoms: z.string().trim().min(1, 'Vui lòng nhập triệu chứng'),
  diagnosis: z.string().trim().min(1, 'Vui lòng nhập chẩn đoán'),
  treatmentPlan: z.string(),
  notes: z.string(),
})

type VisitRecordFormData = z.infer<typeof visitRecordFormSchema>

function valuesFromRecord(
  record: MedicalRecord | undefined,
): VisitRecordFormData {
  if (!record)
    return {
      symptoms: '',
      diagnosis: '',
      treatmentPlan: '',
      notes: '',
    }

  return {
    symptoms: record.symptoms,
    diagnosis: record.diagnosis,
    treatmentPlan: record.treatmentPlan ?? '',
    notes: record.notes ?? '',
  }
}

export function DoctorVisitRecordPanel({
  appointment,
  patientUserId,
  existingRecord,
}: DoctorVisitRecordPanelProps) {
  const doctor = useAuthStore(selectUser)
  const { mutateAsync: createRecord, isPending: isCreating } = useCreateRecord()
  const { mutateAsync: updateRecord, isPending: isUpdating } = useUpdateRecord()

  const form = useForm({
    defaultValues: valuesFromRecord(existingRecord),
    validators: {
      onSubmit: visitRecordFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!doctor || doctor.role !== 'doctor' || !appointment) return

      if (existingRecord) {
        await updateRecord({
          id: existingRecord.id,
          payload: value,
        })
        return
      }

      await createRecord({
        appointmentId: appointment.id,
        patientId: patientUserId,
        doctorId: doctor.id,
        ...value,
      })
    },
  })

  useEffect(() => {
    form.reset(valuesFromRecord(existingRecord))
  }, [existingRecord, form])

  if (!appointment) {
    return (
      <div className="bg-white pr-3">
        <p className="text-lg font-semibold text-slate-700">
          Không tìm thấy lịch khám online
        </p>
        <p className="text-sm text-slate-700">
          Không tìm thấy lịch khám online với bệnh nhân này. Bạn vẫn có thể trò
          chuyện video; hồ sơ có thể tạo sau khi gán đúng lịch hẹn.
        </p>
      </div>
    )
  }

  const canSaveAsDoctor = !!doctor && doctor.role === 'doctor'

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
          <p className="text-lg font-semibold">Lịch hẹn #{appointment.id}</p>
          <p className="text-teal-primary text-sm">
            {formatLongDate(appointment.scheduledAt)} ·{' '}
            {formatTime(appointment.scheduledAt)} ·{' '}
            {appointment.durationMinutes} phút
          </p>
          {appointment.reason ? (
            <p className="text-sm text-slate-700">
              Lý do: {appointment.reason}
            </p>
          ) : null}
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
              disabled={
                !canSaveAsDoctor ||
                !canSubmit ||
                isCreating ||
                isUpdating ||
                isSubmitting
              }>
              {existingRecord ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ bệnh án'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </ScrollArea>
  )
}
