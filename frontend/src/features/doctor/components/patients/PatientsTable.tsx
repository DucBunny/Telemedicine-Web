import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { useGetPatients } from '../../hooks/usePatientQueries'
import { usePagination } from '@/hooks/usePagination'
import { PaginationControls } from '@/components/PaginationControls'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const PatientsTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const { data, isLoading, isError } = useGetPatients({
    page: p.page,
    limit: p.limit,
    search: searchTerm,
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="text-red-500">Lỗi khi tải danh sách bệnh nhân</div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-gray-100 hover:bg-gray-50">
            <TableHead className="py-4 text-gray-500">Bệnh nhân</TableHead>
            <TableHead className="text-gray-500">Giới tính/Tuổi</TableHead>
            <TableHead className="text-gray-500">Nhóm máu</TableHead>
            <TableHead className="text-gray-500">Chiều cao/Cân nặng</TableHead>
            <TableHead className="text-right text-gray-500">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((pat) => (
            <TableRow
              key={pat.userId}
              className="border-gray-100 hover:bg-teal-50/50">
              <TableCell className="py-4">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-8 w-8 border border-teal-100 bg-teal-100 text-teal-600">
                    <AvatarFallback className="bg-teal-100 text-xs font-bold text-teal-700">
                      {pat.user.fullName.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {pat.user.fullName || 'N/A'}
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      ID: PAT-{1000 + pat.userId}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-xs text-gray-600 capitalize md:text-sm">
                  {pat.gender === 'male'
                    ? 'Nam'
                    : pat.gender === 'female'
                      ? 'Nữ'
                      : 'Khác'}
                </span>
                {pat.dateOfBirth && (
                  <>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-xs text-gray-600 md:text-sm">
                      {new Date().getFullYear() -
                        new Date(pat.dateOfBirth).getFullYear()}{' '}
                      tuổi
                    </span>
                  </>
                )}
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-block rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 md:text-xs">
                  {pat.bloodType || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="py-4 text-xs text-gray-600 md:text-sm">
                {pat.height && pat.weight
                  ? `${pat.height}cm / ${pat.weight}kg`
                  : 'N/A'}
              </TableCell>
              <TableCell className="py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-400 hover:bg-white hover:text-teal-600">
                  Chi tiết <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {data?.meta && (
        <div className="rounded-b-xl border-t border-gray-100 bg-gray-50 px-4 py-4 md:px-6">
          <PaginationControls
            currentPage={p.page}
            totalPages={data.meta.totalPages}
            totalItems={data.meta.total}
            itemsPerPage={p.limit}
            onPageChange={p.setPage}
            showItemsInfo
          />
        </div>
      )}
    </div>
  )
}
