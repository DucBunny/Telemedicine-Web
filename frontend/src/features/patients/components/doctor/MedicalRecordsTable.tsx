import { ClipboardCheck, FileText } from 'lucide-react'

import type { MedicalRecord } from '@/features/medicalRecords/types'
import type { UsePaginationReturn } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'

import { MedicalRecordsFilters } from '@/features/patients/components/doctor'
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
import { formatShortDate, formatTime } from '@/lib/format-date'

interface MedicalRecordsTableProps {
  data: ApiPaginatedResponse<MedicalRecord> | undefined
  isLoading?: boolean
  isError?: boolean
  onSelectRecord?: (record: MedicalRecord) => void
  createdFrom?: string
  createdTo?: string
  onApplyFilters: (filters: {
    createdFrom?: string
    createdTo?: string
  }) => void
  pagination: UsePaginationReturn
}

export const MedicalRecordsTable = ({
  data,
  isLoading,
  isError,
  onSelectRecord,
  createdFrom,
  createdTo,
  onApplyFilters,
  pagination,
}: MedicalRecordsTableProps) => {
  const records = data?.data ?? []

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Filters & Title */}
      <div className="flex items-start justify-between gap-3 pb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">
            Lịch sử bệnh án
          </h3>
          <p className="text-sm text-slate-500">
            Tổng hợp chẩn đoán, triệu chứng và đơn thuốc.
          </p>
        </div>

        <div className="flex shrink-0 items-start justify-end gap-2">
          <Badge variant="teal_outline" className="gap-1">
            <ClipboardCheck className="size-3.5" />
            {data?.meta.total} hồ sơ
          </Badge>

          <MedicalRecordsFilters
            createdFrom={createdFrom}
            createdTo={createdTo}
            onApplyFilters={onApplyFilters}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <Table className="min-w-0 table-fixed">
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-gray-100">
              <TableHead className="w-28">Ngày tạo</TableHead>
              <TableHead className="w-20 text-center">Thời gian</TableHead>
              <TableHead className="w-40">Chẩn đoán</TableHead>
              <TableHead className="w-60">Triệu chứng</TableHead>
              <TableHead className="w-26 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-slate-500">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-red-500">
                  Không thể tải lịch sử bệnh án.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && records.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-slate-500">
                  Chưa có hồ sơ bệnh án nào.
                </TableCell>
              </TableRow>
            )}

            {records.map((record) => (
              <TableRow key={record.id}>
                {/* Cột Ngày tạo */}
                <TableCell className="font-medium">
                  {formatShortDate(record.appointment?.scheduledAt || '')}
                </TableCell>

                {/* Cột Thời gian */}
                <TableCell className="text-center text-slate-600">
                  {formatTime(record.appointment?.scheduledAt || '')}
                </TableCell>

                {/* Cột Chẩn đoán */}
                <TableCell className="truncate">
                  {record.diagnosis || 'Đang cập nhật'}
                </TableCell>

                {/* Cột Triệu chứng */}
                <TableCell className="truncate text-slate-600">
                  {record.symptoms || 'Không ghi nhận'}
                </TableCell>

                {/* Cột Hành động */}
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectRecord?.(record)}>
                    <FileText className="size-4" />
                    Xem
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
  )
}
