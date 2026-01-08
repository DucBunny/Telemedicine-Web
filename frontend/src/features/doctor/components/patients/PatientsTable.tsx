import { ChevronRight } from 'lucide-react'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { MOCK_PATIENTS } from '../../data/mockData'
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
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-gray-100 hover:bg-gray-50">
            <TableHead className="py-4 text-gray-500">Bệnh nhân</TableHead>
            <TableHead className="text-gray-500">Giới tính/Tuổi</TableHead>
            <TableHead className="text-gray-500">Nhóm máu</TableHead>
            <TableHead className="text-gray-500">Lần khám cuối</TableHead>
            <TableHead className="text-gray-500">Trạng thái (AI)</TableHead>
            <TableHead className="text-right text-gray-500">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_PATIENTS.map((p) => (
            <TableRow
              key={p.id}
              className="border-gray-100 hover:bg-teal-50/50">
              <TableCell className="py-4">
                <div className="flex items-center">
                  <Avatar className="mr-3 h-8 w-8 border border-teal-100 bg-teal-100 text-teal-600">
                    <AvatarFallback className="bg-teal-100 text-xs font-bold text-teal-700">
                      {p.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {p.full_name}
                    </p>
                    <p className="text-[10px] text-gray-400 md:text-xs">
                      ID: PAT-{1000 + p.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-xs text-gray-600 capitalize md:text-sm">
                  {p.gender === 'male' ? 'Nam' : 'Nữ'}
                </span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-xs text-gray-600 md:text-sm">
                  {p.age} tuổi
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-block rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 md:text-xs">
                  {p.blood_type}
                </span>
              </TableCell>
              <TableCell className="py-4 text-xs text-gray-600 md:text-sm">
                {p.last_visit}
              </TableCell>
              <TableCell className="py-4">
                <DoctorStatusBadge status={p.health_status} />
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

      <div className="flex items-center justify-between rounded-b-xl border-t border-gray-100 bg-gray-50 px-4 py-4 text-xs text-gray-500 md:px-6 md:text-sm">
        <span>Hiển thị {MOCK_PATIENTS.length} trên tổng số 124 bệnh nhân</span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-gray-200 bg-white hover:bg-gray-50">
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-gray-200 bg-white hover:bg-gray-50">
            Sau
          </Button>
        </div>
      </div>
    </div>
  )
}
