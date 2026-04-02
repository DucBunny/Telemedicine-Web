import { Eye, FileUser } from 'lucide-react'
import type { MedicalRecord } from '@/features/patient/types'
import type { UsePaginationReturn } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PaginationControls } from '@/components/PaginationControls'
import { cn } from '@/lib/utils'
import { formatShortDate, formatTime } from '@/lib/format-date'

interface MedicalRecordTableProps {
  data: ApiPaginatedResponse<MedicalRecord> | undefined
  onViewDetail?: (recordId: string) => void
  pagination: UsePaginationReturn
}

export const RecordTable = ({
  data,
  onViewDetail,
  pagination,
}: MedicalRecordTableProps) => {
  const records = data?.data ?? []

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table className="min-w-0 table-fixed">
        <TableHeader className="bg-teal-50">
          <TableRow className="border-gray-100 hover:bg-teal-50">
            <TableHead className="w-30">Ngày khám</TableHead>
            <TableHead>Bác sĩ</TableHead>
            <TableHead className="w-30">Chuyên khoa</TableHead>
            <TableHead>Chẩn đoán</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow
                key={record.id}
                onDoubleClick={() => onViewDetail?.(String(record.id))}
                className="border-gray-100 hover:bg-teal-50/50">
                {/* Cột Ngày & Giờ */}
                <TableCell>
                  <div className="font-medium">
                    {formatShortDate(record.appointment?.scheduledAt || '')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatTime(record.appointment?.scheduledAt || '')}
                  </div>
                </TableCell>

                {/* Cột Bác sĩ */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      )}>
                      <img
                        src={record.doctor?.user.avatar}
                        alt={record.doctor?.user.fullName}
                        className="size-9 rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {record.doctor?.user.fullName}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {record.doctor?.degree}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Cột Chuyên khoa */}
                <TableCell>
                  <Badge variant="teal_outline">
                    {record.doctor?.specialty.name}
                  </Badge>
                </TableCell>

                {/* Cột Chẩn đoán */}
                <TableCell className="min-w-0 truncate">
                  {record.diagnosis}
                </TableCell>

                {/* Cột Hành động */}
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onViewDetail?.(String(record.id))}
                    className="text-teal-primary hover:text-teal-primary-foreground hover:bg-gray-100">
                    <Eye className="size-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-48 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2 text-base">
                  <FileUser className="size-10" />
                  Không tìm thấy hồ sơ nào.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.meta.total !== 0 && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
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
  )
}
