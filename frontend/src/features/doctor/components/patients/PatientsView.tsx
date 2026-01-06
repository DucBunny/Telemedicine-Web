import React from 'react'
import { ChevronRight, Filter, Search, Users } from 'lucide-react'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { MOCK_PATIENTS } from '../../data/mockData'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const PatientsView: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* Simple Filter Bar */}
        <div className="flex w-full space-x-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Tìm tên, CMND..."
              className="h-9 border-gray-200 bg-white pl-9 text-xs focus-visible:ring-teal-500 md:text-sm"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" /> Bộ lọc
          </Button>
        </div>
        <Button className="h-9 w-full bg-teal-600 text-white shadow-sm hover:bg-teal-700 sm:w-auto">
          <Users className="mr-2 h-4 w-4" /> Thêm bệnh nhân
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="px-4 font-medium text-gray-500 md:px-6">
                  Bệnh nhân
                </TableHead>
                <TableHead className="px-4 font-medium text-gray-500 md:px-6">
                  Giới tính/Tuổi
                </TableHead>
                <TableHead className="px-4 font-medium text-gray-500 md:px-6">
                  Nhóm máu
                </TableHead>
                <TableHead className="px-4 font-medium text-gray-500 md:px-6">
                  Lần khám cuối
                </TableHead>
                <TableHead className="px-4 font-medium text-gray-500 md:px-6">
                  Trạng thái (AI)
                </TableHead>
                <TableHead className="px-4 text-right font-medium text-gray-500 md:px-6">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PATIENTS.map((p) => (
                <TableRow
                  key={p.id}
                  className="group border-gray-100 transition-colors hover:bg-teal-50/30">
                  <TableCell className="px-4 py-4 md:px-6">
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
                  <TableCell className="px-4 py-4 md:px-6">
                    <span className="text-xs text-gray-600 capitalize md:text-sm">
                      {p.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-xs text-gray-600 md:text-sm">
                      {p.age} tuổi
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 md:px-6">
                    <span className="inline-block rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 md:text-xs">
                      {p.blood_type}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-xs text-gray-600 md:px-6 md:text-sm">
                    {p.last_visit}
                  </TableCell>
                  <TableCell className="px-4 py-4 md:px-6">
                    <DoctorStatusBadge status={p.health_status} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right md:px-6">
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
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-4 text-xs text-gray-500 md:px-6 md:text-sm">
          <span>
            Hiển thị {MOCK_PATIENTS.length} trên tổng số 124 bệnh nhân
          </span>
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
      </Card>
    </div>
  )
}
