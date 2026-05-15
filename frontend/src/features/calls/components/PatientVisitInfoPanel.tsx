import type { Appointment } from '@/features/appointments/types'

import { formatLongDate, formatTime } from '@/lib/format-date'

export interface PatientVisitInfoPanelProps {
  appointment: Appointment | null
  doctorName?: string
}

export function PatientVisitInfoPanel({
  appointment,
  doctorName,
}: PatientVisitInfoPanelProps) {
  if (!appointment) {
    return (
      <div className="bg-white pr-3">
        <p className="text-lg font-semibold text-slate-700">
          Không tìm thấy lịch khám online
        </p>
        <p className="text-sm text-slate-700">
          Không tìm thấy lịch khám online tương ứng. Bạn vẫn có thể tham gia
          cuộc gọi khi bác sĩ mời.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1 bg-white p-4">
      <p className="text-lg font-semibold">Khám trực tuyến</p>
      {doctorName ? (
        <p className="text-base font-medium text-slate-700">
          Bác sĩ {doctorName}
        </p>
      ) : null}
      <p className="text-teal-primary text-sm">
        {formatLongDate(appointment.scheduledAt)} ·{' '}
        {formatTime(appointment.scheduledAt)}
      </p>
      {appointment.reason ? (
        <p className="text-sm text-slate-700">Lý do: {appointment.reason}</p>
      ) : null}
    </div>
  )
}
