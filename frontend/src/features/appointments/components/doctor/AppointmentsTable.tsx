import { useState } from 'react'
import { Calendar, CheckCircle, Hospital, Info, Video, X } from 'lucide-react'

import type { Appointment } from '@/features/appointments/types'
import type { UsePaginationReturn } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'

import {
  AppointmentDetailDialog,
  CancelAppointmentDialog,
} from '@/features/appointments/components/doctor'
import { useConfirmAppointment } from '@/features/appointments/hooks/useAppointmentQueries'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import LoaderScreen from '@/components/common/Loader'
import { PaginationControls } from '@/components/common/PaginationControls'
import { SafeImage } from '@/components/common/SafeImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatShortDate, formatTime } from '@/lib/format-date'
import { APPOINTMENT_STATUS_FILTERS } from '@/types/constants'

interface AppointmentsTableProps {
  data: ApiPaginatedResponse<Appointment> | undefined
  pagination: UsePaginationReturn
  isLoading: boolean
  isError: boolean
}

export const AppointmentsTable = ({
  data,
  pagination,
  isLoading,
  isError,
}: AppointmentsTableProps) => {
  const appointments = data?.data ?? []

  // Dialog states
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const { mutateAsync: confirmAppointment } = useConfirmAppointment()

  if (isLoading) return <LoaderScreen className="h-64" />

  if (isError) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="text-red-500">Lỗi khi tải danh sách bệnh nhân</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table className="min-w-0 table-fixed">
        <TableHeader className="bg-teal-50">
          <TableRow className="border-gray-100 hover:bg-teal-50">
            <TableHead className="w-50">Bệnh nhân</TableHead>
            <TableHead className="w-25">Thời gian</TableHead>
            <TableHead className="w-25 text-center">Loại khám</TableHead>
            <TableHead className="w-50">Lý do</TableHead>
            <TableHead className="w-25 text-center">Trạng thái</TableHead>
            <TableHead className="w-32"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appt) => {
              const isOnline = appt.type === 'online'
              const statusOption = APPOINTMENT_STATUS_FILTERS[appt.status]
              const isCancelled = appt.status === 'cancelled'

              return (
                <TableRow
                  key={appt.id}
                  className="border-gray-100 hover:bg-teal-50/50">
                  {/* Cột bệnh nhân */}
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <SafeImage
                        src={appt.patient?.user.avatar}
                        alt={appt.patient?.user.fullName}
                        className="size-9 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {appt.patient?.user.fullName}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          Hồ sơ #{appt.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột thời gian */}
                  <TableCell>
                    <div className="text-sm font-medium">
                      {formatTime(appt.scheduledAt)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatShortDate(appt.scheduledAt)}
                    </div>
                  </TableCell>

                  {/* Cột loại khám */}
                  <TableCell className="text-center">
                    <Badge
                      variant={isOnline ? 'orange_blur' : 'green_blur'}
                      className="text-xs">
                      {isOnline ? (
                        <Video className="size-4!" />
                      ) : (
                        <Hospital className="size-4!" />
                      )}
                      {isOnline ? 'Online' : 'Trực tiếp'}
                    </Badge>
                  </TableCell>

                  {/* Cột lý do */}
                  <TableCell className="max-w-xs min-w-0 truncate text-xs md:text-sm">
                    {isCancelled ? appt.cancelReason : appt.reason}
                  </TableCell>

                  {/* Cột trạng thái */}
                  <TableCell className="text-center">
                    <Badge variant={statusOption.variant || 'default'}>
                      {statusOption.label}
                    </Badge>
                  </TableCell>

                  {/* Cột hành động */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {appt.status === 'pending' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => {
                                setSelectedAppointment(appt)
                                setIsConfirmDialogOpen(true)
                              }}>
                              <CheckCircle className="size-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Xác nhận</TooltipContent>
                        </Tooltip>
                      )}

                      {['pending', 'confirmed'].includes(appt.status) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                setSelectedAppointment(appt)
                                setIsCancelDialogOpen(true)
                              }}>
                              <X className="size-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Hủy</TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="hover:text-teal-primary text-gray-400 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedAppointment(appt)
                              setIsDetailDialogOpen(true)
                            }}>
                            <Info className="size-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Xem chi tiết</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2 text-base">
                  <Calendar className="size-10 text-gray-300" />
                  Không tìm thấy lịch hẹn nào.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.meta.total !== 0 && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 md:px-6">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={data?.meta.totalPages ?? 0}
            totalItems={data?.meta.total}
            itemsPerPage={pagination.limit}
            onPageChange={pagination.setPage}
            showItemsInfo
          />
        </div>
      )}

      <AppointmentDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={() => setIsDetailDialogOpen(false)}
        appointment={selectedAppointment}
      />

      <CancelAppointmentDialog
        isOpen={isCancelDialogOpen}
        onOpenChange={() => setIsCancelDialogOpen(false)}
        appointmentId={selectedAppointment?.id ?? 0}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Xác nhận lịch hẹn"
        description={
          <p>
            Bạn có chắc chắn muốn xác nhận lịch hẹn với bệnh nhân{' '}
            <span className="text-teal-primary font-semibold">
              {selectedAppointment?.patient?.user.fullName ?? 'Chưa xác định'}
            </span>{' '}
            vào lúc{' '}
            <span className="text-teal-primary font-semibold">
              {formatTime(selectedAppointment?.scheduledAt ?? new Date())}
            </span>{' '}
            ngày{' '}
            <span className="text-teal-primary font-semibold">
              {formatShortDate(selectedAppointment?.scheduledAt ?? new Date())}
            </span>{' '}
            không?
          </p>
        }
        cancelButton={
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsConfirmDialogOpen(false)}
            className="text-sm">
            Hủy
          </Button>
        }
        confirmButton={
          <Button
            type="button"
            variant="teal_primary"
            onClick={() => {
              confirmAppointment(selectedAppointment?.id ?? 0)
              setIsConfirmDialogOpen(false)
            }}
            className="text-sm">
            Xác nhận
          </Button>
        }
      />
    </div>
  )
}
