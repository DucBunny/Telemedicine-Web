import { Calendar, Eye } from 'lucide-react'

import type { Patient } from '@/features/patients/types'
import type { usePagination } from '@/hooks/usePagination'
import type { ApiPaginatedResponse } from '@/types/api.type'

import LoaderScreen from '@/components/common/Loader'
import { PaginationControls } from '@/components/common/PaginationControls'
import { SafeImage } from '@/components/common/SafeImage'
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
import { formatShortDate } from '@/lib/format-date'

interface PatientsTableProps {
  data: ApiPaginatedResponse<Patient> | undefined
  isLoading: boolean
  isError: boolean
  pagination: ReturnType<typeof usePagination>
  onViewDetail?: (patientId: number) => void
}

export const PatientsTable = ({
  data,
  isLoading,
  isError,
  pagination,
  onViewDetail,
}: PatientsTableProps) => {
  const patients = data?.data ?? []

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
            <TableHead className="w-22 text-center">Ngày sinh</TableHead>
            <TableHead className="w-18 text-center">Giới tính</TableHead>
            <TableHead className="w-22 text-center">Nhóm máu</TableHead>
            <TableHead className="w-30 text-center">C.cao/Cân nặng</TableHead>
            <TableHead className="w-26 text-center">Số điện thoại</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.length > 0 ? (
            patients.map((pat) => (
              <TableRow
                key={pat.userId}
                className="border-gray-100 hover:bg-teal-50/50">
                {/* Cột bệnh nhân */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <SafeImage
                      src={pat.user.avatar}
                      alt={pat.user.fullName}
                      className="size-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {pat.user.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Bệnh nhân #{pat.userId}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Cột ngày sinh */}
                <TableCell className="text-center text-sm text-gray-700">
                  {pat.dateOfBirth ? formatShortDate(pat.dateOfBirth) : 'N/A'}
                </TableCell>

                {/* Cột giới tính */}
                <TableCell className="text-center text-sm text-gray-700">
                  {pat.gender === 'male'
                    ? 'Nam'
                    : pat.gender === 'female'
                      ? 'Nữ'
                      : 'Khác'}
                </TableCell>

                {/* Cột nhóm máu */}
                <TableCell className="text-center">
                  <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                    {pat.bloodType}
                  </span>
                </TableCell>

                {/* Cột chiều cao/cân nặng */}
                <TableCell className="text-center text-sm text-gray-700">
                  {`${pat.height || '-'}cm / ${pat.weight || '-'}kg`}
                </TableCell>

                {/* Cột số điện thoại */}
                <TableCell className="text-center text-sm text-gray-700">
                  {pat.user.phoneNumber}
                </TableCell>

                {/* Cột hành động */}
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:text-teal-primary text-gray-400 hover:bg-gray-100"
                        onClick={() => onViewDetail?.(pat.userId)}
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
              <TableCell colSpan={7} className="h-48 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2 text-base">
                  <Calendar className="size-10 text-gray-300" />
                  Không tìm thấy bệnh nhân nào.
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
    </div>
  )
}
