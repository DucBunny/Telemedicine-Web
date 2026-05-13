import { useEffect, useMemo, useState } from 'react'
import { CloudSun, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { useDebounceValue } from 'usehooks-ts'

import type { AppointmentType } from '@/features/appointments/types'
import type { Patient } from '@/features/patients/types'

import { TimeSlotGrid } from '@/features/appointments/components/patient'
import {
  useCreateAppointment,
  useGetAvailableSlots,
} from '@/features/appointments/hooks/useAppointmentQueries'
import { useGetMyPatients } from '@/features/patients/hooks/usePatientQueries'
import { DatePicker } from '@/components/form/DatePicker'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatDateForApi, toUtcIsoFromVietnamLocal } from '@/lib/format-date'
import { useAuthStore } from '@/stores/auth.store'
import { BASE_AFTERNOON_SLOTS, BASE_MORNING_SLOTS } from '@/types/constants'

interface CreateAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateAppointmentDialog = ({
  open,
  onOpenChange,
}: CreateAppointmentDialogProps) => {
  const user = useAuthStore((s) => s.user)
  const doctorId = user?.id

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500)

  const [selectedPatientUserId, setSelectedPatientUserId] = useState<
    number | null
  >(null)
  /** Giữ BN đã chọn để hiển thị nhãn khi không còn trong batch API hiện tại */
  const [anchorPatient, setAnchorPatient] = useState<Patient | null>(null)

  // Form state
  const [visitType, setVisitType] = useState<AppointmentType>('offline')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [reason, setReason] = useState('')

  const formattedDate = formatDateForApi(selectedDate)

  const { data: patientsData } = useGetMyPatients({
    page: 1,
    limit: 80,
    search: debouncedSearch,
  })

  const { data: availableSlots } = useGetAvailableSlots(
    {
      doctorId: doctorId ?? 0,
      date: formattedDate,
    },
    { enabled: open && !!doctorId },
  )

  const morningSlots = useMemo(
    () =>
      BASE_MORNING_SLOTS.map((slot) => ({
        ...slot,
        isAvailable: availableSlots?.includes(slot.time) ?? false,
      })),
    [availableSlots],
  )

  const afternoonSlots = useMemo(
    () =>
      BASE_AFTERNOON_SLOTS.map((slot) => ({
        ...slot,
        isAvailable: availableSlots?.includes(slot.time) ?? false,
      })),
    [availableSlots],
  )

  useEffect(() => {
    const merged = [...morningSlots, ...afternoonSlots]
    const availableTimes = merged
      .filter((s) => s.isAvailable)
      .map((s) => s.time)
    if (!availableTimes.includes(selectedTime) && availableTimes.length > 0)
      setSelectedTime(availableTimes[0])
  }, [morningSlots, afternoonSlots, selectedTime])

  const { mutateAsync: createAppointment, isPending } = useCreateAppointment()

  const patientRows = patientsData?.data ?? []

  const comboPatientIds = useMemo(() => {
    const ids = patientRows.map((p) => p.userId)
    if (anchorPatient != null && !ids.includes(anchorPatient.userId)) {
      return [anchorPatient.userId, ...ids]
    }
    return ids
  }, [patientRows, anchorPatient])

  const patientLabel = useMemo(() => {
    return (id: number) => {
      const fromRows = patientRows.find((p) => p.userId === id)
      if (fromRows) return fromRows.user.fullName
      if (anchorPatient?.userId === id) return anchorPatient.user.fullName
      return ''
    }
  }, [patientRows, anchorPatient])

  const resetForm = () => {
    setSearch('')
    setSelectedPatientUserId(null)
    setAnchorPatient(null)
    setReason('')
    setVisitType('offline')
    setSelectedDate(new Date())
    setSelectedTime('09:00')
  }

  const handleSubmit = async () => {
    if (!doctorId) return
    if (selectedPatientUserId == null) {
      toast.error('Vui lòng chọn bệnh nhân')
      return
    }
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do tạo lịch')
      return
    }

    const merged = [...morningSlots, ...afternoonSlots]
    const slotOk = merged.some((s) => s.time === selectedTime && s.isAvailable)
    if (!slotOk) {
      toast.error('Khung giờ không còn trống')
      return
    }

    const scheduledAt = toUtcIsoFromVietnamLocal(formattedDate, selectedTime)
    try {
      await createAppointment({
        patientId: selectedPatientUserId,
        scheduledAt,
        durationMinutes: 30,
        type: visitType,
        reason: reason.trim(),
      })
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error('[Appointments] Doctor Create Appointment Error:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm()
        onOpenChange(next)
      }}>
      <DialogContent
        className="scrollbar-hide max-h-[90vh] overflow-y-auto rounded-4xl bg-white p-0"
        showCloseButton={false}>
        {/* Header */}
        <DialogHeader className="border-b border-gray-100 p-3 md:p-5 md:pb-4">
          <DialogTitle className="text-center text-lg font-bold text-gray-900">
            Tạo lịch hẹn
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-3 overflow-y-auto p-5 pt-0">
          {/* Patient */}
          <div>
            <Label htmlFor="patient-combobox-input" className="text-slate-700">
              Bệnh nhân
            </Label>
            <Combobox
              items={comboPatientIds}
              value={selectedPatientUserId ?? undefined}
              onValueChange={(next) => {
                setSelectedPatientUserId(next ?? null)
                if (next == null) {
                  setAnchorPatient(null)
                  return
                }
                const picked = patientRows.find((p) => p.userId === next)
                if (picked) setAnchorPatient(picked)
              }}
              inputValue={search}
              onInputValueChange={setSearch}
              itemToStringLabel={patientLabel}
              filter={() => true}>
              <ComboboxInput
                id="patient-combobox-input"
                placeholder="Tìm bệnh nhân..."
                className="mt-1 h-10 w-full rounded-xl border-gray-300"
              />
              <ComboboxContent className="rounded-md">
                <ComboboxList className="max-h-[min(280px,40vh)]">
                  {(item: number) => (
                    <ComboboxItem key={item} value={item}>
                      {patientLabel(item) || `#${item}`}
                    </ComboboxItem>
                  )}
                </ComboboxList>
                <ComboboxEmpty>Không tìm thấy bệnh nhân.</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Visit Type */}
          <div>
            <Label htmlFor="visit-type" className="text-slate-700">
              Loại khám
            </Label>
            <Select
              value={visitType}
              onValueChange={(v) => setVisitType(v as AppointmentType)}>
              <SelectTrigger
                id="visit-type"
                className="mt-1 h-10! w-full rounded-xl">
                <SelectValue placeholder="Chọn loại khám" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="offline">Tại phòng khám</SelectItem>
                <SelectItem value="online">Tư vấn Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <DatePicker
            label="Ngày khám"
            name="appointment-date"
            value={selectedDate}
            onChange={(d) => {
              if (d) setSelectedDate(d)
            }}
            placeholder="Chọn ngày khám"
            className="h-10 rounded-xl border-gray-300"
          />

          <TimeSlotGrid
            title="Buổi sáng"
            icon={Sun}
            iconColor="text-yellow-500"
            slots={morningSlots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            gridClassName="grid-cols-4!"
          />

          <TimeSlotGrid
            title="Buổi chiều"
            icon={CloudSun}
            iconColor="text-orange-500"
            slots={afternoonSlots}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            gridClassName="grid-cols-4!"
          />

          <div>
            <Label htmlFor="reason" className="text-slate-700">
              Lý do
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do..."
              className="mt-1 min-h-[88px] rounded-xl"
              maxLength={500}
            />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              size="lg"
              type="button"
              variant="teal_primary"
              className="w-full rounded-full text-sm"
              disabled={isPending || !doctorId}
              onClick={() => void handleSubmit()}>
              {isPending ? 'Đang tạo...' : 'Tạo lịch'}
            </Button>
            <Button
              size="lg"
              type="button"
              variant="outline"
              className="w-full rounded-full text-sm"
              onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
