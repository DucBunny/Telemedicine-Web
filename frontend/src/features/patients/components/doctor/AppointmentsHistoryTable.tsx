import { useState } from 'react'
import {
  CalendarCheck,
  CheckCircle,
  Hospital,
  Info,
  Video,
  X,
} from 'lucide-react'

import type {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'
import type { UsePaginationReturn } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'

import {
  AppointmentDetailDialog,
  CancelAppointmentDialog,
} from '@/features/appointments/components/doctor'
import { useConfirmAppointment } from '@/features/appointments/hooks/useAppointmentQueries'
import { AppointmentsHistoryFilters } from '@/features/patients/components/doctor'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { PaginationControls } from '@/components/common/PaginationControls'
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

interface AppointmentsHistoryTableProps {
  data: ApiPaginatedResponse<Appointment> | undefined
  isLoading?: boolean
  isError?: boolean
  statusFilter: 'all' | AppointmentStatus
  typeFilter: 'all' | AppointmentType
  scheduledFrom?: string
  scheduledTo?: string
  onApplyFilters: (filters: {
    statusFilter: 'all' | AppointmentStatus
    typeFilter: 'all' | AppointmentType
    scheduledFrom?: string
    scheduledTo?: string
  }) => void
  pagination: UsePaginationReturn
}

export const AppointmentsHistoryTable = ({
  data,
  isLoading,
  isError,
  statusFilter,
  typeFilter,
  scheduledFrom,
  scheduledTo,
  onApplyFilters,
  pagination,
}: AppointmentsHistoryTableProps) => {
  const appointments = data?.data ?? []

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const { mutateAsync: confirmAppointment } = useConfirmAppointment()

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* Filters & Title */}
        <div className="flex items-start justify-between gap-3 pb-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">
              Lịch sử hẹn
            </h3>
            <p className="text-sm text-slate-500">
              Lịch hẹn đã, đang và sắp diễn ra.
            </p>
          </div>

          <div className="flex shrink-0 items-start justify-end gap-2">
            <Badge variant="purple_outline" className="hidden md:flex">
              <CalendarCheck className="size-3.5" />
              {data?.meta.total} lịch
            </Badge>

            <AppointmentsHistoryFilters
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              scheduledFrom={scheduledFrom}
              scheduledTo={scheduledTo}
              onApplyFilters={onApplyFilters}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <Table className="min-w-0 table-fixed">
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-gray-100">
                <TableHead className="w-28">Ngày</TableHead>
                <TableHead className="w-20 text-center">Thời gian</TableHead>
                <TableHead className="w-25 text-center">Loại khám</TableHead>
                <TableHead className="w-50">Lý do</TableHead>
                <TableHead className="w-30 text-center">Trạng thái</TableHead>
                <TableHead className="w-32 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              )}

              {isError && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-red-500">
                    Không thể tải lịch sử hẹn.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && appointments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-slate-500">
                    Chưa có lịch hẹn nào.
                  </TableCell>
                </TableRow>
              )}

              {appointments.map((appointment) => {
                const isOnline = appointment.type === 'online'
                const statusOption =
                  APPOINTMENT_STATUS_FILTERS[appointment.status]
                const isCancelled = appointment.status === 'cancelled'

                return (
                  <TableRow key={appointment.id}>
                    {/* Cột Ngày */}
                    <TableCell className="font-medium">
                      {formatShortDate(appointment.scheduledAt)}
                    </TableCell>

                    {/* Cột Thời gian */}
                    <TableCell className="text-center text-slate-600">
                      {formatTime(appointment.scheduledAt)}
                    </TableCell>

                    {/* Cột Loại khám */}
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

                    {/* Cột Lý do */}
                    <TableCell className="truncate">
                      {isCancelled
                        ? appointment.cancelReason
                        : appointment.reason}
                    </TableCell>

                    {/* Cột Trạng thái */}
                    <TableCell className="text-center">
                      <Badge variant={statusOption.variant || 'default'}>
                        {statusOption.label}
                      </Badge>
                    </TableCell>

                    {/* Cột Hành động */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {appointment.status === 'pending' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setIsConfirmDialogOpen(true)
                                }}>
                                <CheckCircle className="size-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Xác nhận</TooltipContent>
                          </Tooltip>
                        )}

                        {['pending', 'confirmed'].includes(
                          appointment.status,
                        ) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
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
                                setSelectedAppointment(appointment)
                                setIsDetailDialogOpen(true)
                              }}>
                              <Info className="size-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Xem chi tiết
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
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
        </div>
      </div>

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
    </>
  )
}
