import {
  Calendar,
  Clock,
  FileText,
  Link as LinkIcon,
  Stethoscope,
  User,
  XCircle,
} from 'lucide-react'
import { STATUS_FILTER_OPTIONS } from '../../config'
import type { ReactNode } from 'react'
import type { Appointment } from '../../types'
import { formatLongDate, formatTime } from '@/lib/format-date'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface InfoRowProps {
  icon: ReactNode
  iconBg: string
  label: string
  children: ReactNode
}

/**
 * Component to display detailed information about an appointment in a dialog.
 */
const InfoRow = ({ icon, iconBg, label, children }: InfoRowProps) => (
  <div className="flex items-start gap-3">
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      {children}
    </div>
  </div>
)

interface AppointmentDetailDialogProps {
  appointment: Appointment | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog to display detailed information about an appointment.
 */
export const AppointmentDetailDialog = ({
  appointment,
  isOpen,
  onOpenChange,
}: AppointmentDetailDialogProps) => {
  if (!appointment) return null

  const status = STATUS_FILTER_OPTIONS.find(
    (s) => s.value === appointment.status,
  ) ?? {
    label: appointment.status,
    color: 'bg-gray-100 text-gray-600',
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md overflow-hidden rounded-2xl border-0 p-0"
        showCloseButton={false}>
        {/* Header */}
        <div className="bg-teal-600 px-6 pt-6 pb-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Chi tiết lịch hẹn
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <User size={24} className="text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                {appointment.doctor?.user.fullName ?? 'Bác sĩ chưa xác định'}
              </p>
              <p className="text-sm text-teal-100">
                {appointment.doctor?.specialization ??
                  'Chuyên khoa chưa xác định'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 pt-3 pb-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Trạng thái</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Date & Time */}
          <InfoRow
            icon={<Calendar size={18} className="text-teal-600" />}
            iconBg="bg-teal-50"
            label="Ngày hẹn">
            <p className="text-sm font-medium text-gray-800">
              {formatLongDate(appointment.scheduledAt)}
            </p>
          </InfoRow>

          <InfoRow
            icon={<Clock size={18} className="text-blue-500" />}
            iconBg="bg-blue-50"
            label="Giờ hẹn">
            <p className="text-sm font-medium text-gray-800">
              {formatTime(appointment.scheduledAt)}
              {appointment.endedAt && (
                <span className="text-gray-400">
                  {' - '}
                  {formatTime(appointment.endedAt)}
                </span>
              )}
            </p>
          </InfoRow>

          {/* Doctor info */}
          {appointment.doctor && (
            <InfoRow
              icon={<Stethoscope size={18} className="text-purple-500" />}
              iconBg="bg-purple-50"
              label="Kinh nghiệm">
              <p className="text-sm font-medium text-gray-800">
                {appointment.doctor.experienceYears} năm
                {appointment.doctor.degree
                  ? ` - ${appointment.doctor.degree}`
                  : ''}
              </p>
            </InfoRow>
          )}

          {/* Reason */}
          {appointment.reason && (
            <InfoRow
              icon={<FileText size={18} className="text-orange-500" />}
              iconBg="bg-orange-50"
              label="Lý do khám">
              <p className="text-sm leading-snug font-medium text-gray-800">
                {appointment.reason}
              </p>
            </InfoRow>
          )}

          {/* Cancel reason */}
          {appointment.cancelReason && (
            <InfoRow
              icon={<XCircle size={18} className="text-red-500" />}
              iconBg="bg-red-50"
              label="Lý do hủy">
              <p className="text-sm leading-snug font-medium text-red-600">
                {appointment.cancelReason}
              </p>
            </InfoRow>
          )}

          {/* Meeting link */}
          {appointment.meetingLink && (
            <InfoRow
              icon={<LinkIcon size={18} className="text-blue-500" />}
              iconBg="bg-blue-50"
              label="Link cuộc họp">
              <a
                href={appointment.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium break-all text-teal-600 hover:underline">
                {appointment.meetingLink}
              </a>
            </InfoRow>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}>
              Đóng
            </Button>

            {appointment.meetingLink && (
              <Button
                className="flex-1 gap-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
                asChild>
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  Tham gia
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
