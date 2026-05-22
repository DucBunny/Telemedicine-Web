import { useState } from 'react'
import { Calendar, Eye } from 'lucide-react'

import type { Alert } from '@/features/alerts/types'
import type { usePagination } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'

import { AlertDetailDialog } from '@/features/alerts/components/doctor'
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
import { cn } from '@/lib/utils'
import { ALERT_STATUS_FILTERS } from '@/types/constants'

interface AlertsTableProps {
  data: ApiPaginatedResponse<Alert> | undefined
  isLoading: boolean
  isError: boolean
  pagination: ReturnType<typeof usePagination>
}

export const AlertsTable = ({
  data,
  isLoading,
  isError,
  pagination,
}: AlertsTableProps) => {
  const alerts = data?.data ?? []

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null)

  // Cập nhật alert trong dialog khi socket emit alert:updated
  const detailAlert =
    selectedAlertId != null
      ? (alerts.find((a) => a.id === selectedAlertId) ?? null)
      : null

  if (isLoading) return <LoaderScreen className="h-64" />

  if (isError) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="text-red-500">Lỗi khi tải danh sách cảnh báo</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table className="min-w-0 table-fixed">
        <TableHeader className="bg-teal-50">
          <TableRow className="border-gray-100 hover:bg-teal-50">
            <TableHead className="w-25">Thời gian</TableHead>
            <TableHead className="w-50">Bệnh nhân</TableHead>
            <TableHead className="w-50">Nội dung</TableHead>
            <TableHead className="w-14 text-center">Số lần</TableHead>
            <TableHead className="w-24 text-center">Trạng thái</TableHead>
            <TableHead className="w-40">Người xử lý</TableHead>
            <TableHead className="w-20">Xử lý lúc</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <TableRow
                key={alert.id}
                className={cn(
                  'border-gray-100 hover:bg-teal-50/50',
                  alert.status === 'pending' && 'bg-red-50/50',
                  alert.status === 'handling' && 'bg-blue-50/50',
                )}>
                {/* Cột thời gian cảnh báo */}
                <TableCell>
                  <div className="text-sm font-medium">
                    {formatTime(alert.createdAt)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatShortDate(alert.createdAt)}
                  </div>
                </TableCell>

                {/* Cột bệnh nhân */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <SafeImage
                      src={alert.patient?.user.avatar}
                      alt={alert.patient?.user.fullName}
                      className="size-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {alert.patient?.user.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Bệnh nhân #{alert.patient?.userId}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Cột nội dung */}
                <TableCell className="text-sm text-gray-700">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {alert.message}
                  </p>
                </TableCell>

                {/* Cột số lần bất thường */}
                <TableCell className="text-center">
                  <Badge
                    variant={
                      alert.anomalyCount >= 10
                        ? 'destructive'
                        : alert.anomalyCount >= 5
                          ? 'warning'
                          : 'secondary'
                    }>
                    {alert.anomalyCount}x
                  </Badge>
                </TableCell>

                {/* Cột trạng thái */}
                <TableCell className="text-center text-sm text-gray-700">
                  <Badge
                    variant={
                      ALERT_STATUS_FILTERS[alert.status].variant || 'default'
                    }>
                    {ALERT_STATUS_FILTERS[alert.status].label}
                  </Badge>
                </TableCell>

                {/* Cột người xử lý */}
                <TableCell>
                  {alert.handledByDoctor ? (
                    <>BS. {alert.handledByDoctor.user.fullName}</>
                  ) : (
                    '—'
                  )}
                </TableCell>

                {/* Cột thời gian xử lý */}
                <TableCell>
                  {alert.resolvedAt ? (
                    <>
                      <div className="text-sm font-medium">
                        {formatTime(alert.resolvedAt)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatShortDate(alert.resolvedAt)}
                      </div>
                    </>
                  ) : (
                    '—'
                  )}
                </TableCell>

                {/* Cột hành động */}
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-teal-primary text-gray-400 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedAlertId(alert.id)
                          setIsDetailDialogOpen(true)
                        }}
                        aria-label="Xem chi tiết">
                        <Eye className="size-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Xem chi tiết</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-48 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2 text-base">
                  <Calendar className="size-10 text-gray-300" />
                  Không tìm thấy cảnh báo nào.
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

      <AlertDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        alert={detailAlert}
      />
    </div>
  )
}
