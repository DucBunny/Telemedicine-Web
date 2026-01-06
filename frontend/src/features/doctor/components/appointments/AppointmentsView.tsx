import React, { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Filter,
  MoreVertical,
  Users,
  Video,
  X,
} from 'lucide-react'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { MOCK_APPOINTMENTS } from '../../data/mockData'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const AppointmentsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredAppointments =
    filterStatus === 'all'
      ? MOCK_APPOINTMENTS
      : MOCK_APPOINTMENTS.filter((a) => a.status === filterStatus)

  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'confirmed', label: 'Đã xác nhận' },
    { id: 'pending', label: 'Chờ duyệt' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-4 md:space-y-6">
      {/* Filters & Actions */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center">
          <div className="no-scrollbar flex w-full space-x-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
            {filters.map((f) => (
              <Button
                key={f.id}
                variant="ghost"
                onClick={() => setFilterStatus(f.id)}
                className={cn(
                  'h-9 flex-shrink-0 rounded-lg text-xs font-medium whitespace-nowrap transition-colors md:text-sm',
                  filterStatus === f.id
                    ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700 hover:text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )}>
                {f.label}
              </Button>
            ))}
          </div>
          <div className="flex w-full items-center space-x-3 sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="date"
                className="h-9 w-full border-gray-200 py-2 pr-4 pl-9 text-xs focus-visible:ring-teal-500 md:text-sm"
              />
            </div>
            <Button className="h-9 bg-teal-600 text-xs whitespace-nowrap text-white shadow-sm hover:bg-teal-700 md:text-sm">
              + Đặt lịch mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="px-4 font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Bệnh nhân
                </TableHead>
                <TableHead className="px-4 font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Thời gian
                </TableHead>
                <TableHead className="px-4 font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Loại khám
                </TableHead>
                <TableHead className="px-4 font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Lý do khám
                </TableHead>
                <TableHead className="px-4 font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Trạng thái
                </TableHead>
                <TableHead className="px-4 text-right font-medium whitespace-nowrap text-gray-500 md:px-6">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="group border-gray-100 transition-colors hover:bg-teal-50/30">
                    <TableCell className="px-4 py-4 md:px-6">
                      <div className="flex items-center">
                        <Avatar className="mr-3 h-8 w-8 border border-gray-100">
                          <AvatarImage src={appt.avatar} />
                          <AvatarFallback>
                            {appt.patient_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {appt.patient_name}
                          </p>
                          <p className="text-[10px] text-gray-400 md:text-xs">
                            Hồ sơ #{appt.id + 100}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 md:px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-900 md:text-sm">
                          {appt.time}
                        </span>
                        <span className="text-[10px] text-gray-500 md:text-xs">
                          {appt.date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 md:px-6">
                      <span
                        className={cn(
                          'inline-flex items-center rounded border border-transparent px-2.5 py-0.5 text-[10px] font-medium md:text-xs',
                          appt.type === 'Telehealth'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800',
                        )}>
                        {appt.type === 'Telehealth' ? (
                          <Video className="mr-1 h-3 w-3" />
                        ) : (
                          <Users className="mr-1 h-3 w-3" />
                        )}
                        {appt.type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate px-4 py-4 text-xs text-gray-600 md:px-6 md:text-sm">
                      {appt.reason}
                    </TableCell>
                    <TableCell className="px-4 py-4 md:px-6">
                      <DoctorStatusBadge status={appt.status} />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right md:px-6">
                      <div className="flex items-center justify-end space-x-1">
                        {appt.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700">
                              <CheckCircle size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                              <X size={18} />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:bg-gray-100 hover:text-teal-600">
                          <MoreVertical size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-48 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar className="mb-2 h-10 w-10 text-gray-300" />
                      <p>Không tìm thấy lịch hẹn nào.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
