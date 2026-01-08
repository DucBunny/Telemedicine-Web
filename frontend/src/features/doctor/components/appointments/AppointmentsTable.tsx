import {
  Calendar,
  CheckCircle,
  MoreVertical,
  Users,
  Video,
  X,
} from 'lucide-react'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import type { Appointment } from '../../types'
import { Button } from '@/components/ui/button'
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

interface AppointmentsTableProps {
  filteredAppointments: Array<Appointment>
}

export const AppointmentsTable = ({
  filteredAppointments,
}: AppointmentsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-teal-50">
          <TableRow className="border-gray-100 hover:bg-teal-50">
            <TableHead className="text-gray-500">Bệnh nhân</TableHead>
            <TableHead className="text-gray-500">Thời gian</TableHead>
            <TableHead className="text-gray-500">Loại khám</TableHead>
            <TableHead className="text-gray-500">Lý do khám</TableHead>
            <TableHead className="text-gray-500">Trạng thái</TableHead>
            <TableHead className="py-4 text-right text-gray-500">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <TableRow
                key={appt.id}
                className="border-gray-100 hover:bg-teal-50/50">
                <TableCell className="py-4">
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
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900 md:text-sm">
                      {appt.time}
                    </span>
                    <span className="text-[10px] text-gray-500 md:text-xs">
                      {appt.date}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded border border-transparent px-2.5 py-0.5 text-[10px] font-medium md:text-xs',
                      appt.type === 'Khám từ xa'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800',
                    )}>
                    {appt.type === 'Khám từ xa' ? (
                      <Video className="mr-1 h-3 w-3" />
                    ) : (
                      <Users className="mr-1 h-3 w-3" />
                    )}
                    {appt.type}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate py-4 text-xs text-gray-600 md:text-sm">
                  {appt.reason}
                </TableCell>
                <TableCell className="py-4">
                  <DoctorStatusBadge status={appt.status} />
                </TableCell>
                <TableCell className="py-4 text-right">
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
              <TableCell colSpan={6} className="h-48 text-center text-gray-500">
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
  )
}
