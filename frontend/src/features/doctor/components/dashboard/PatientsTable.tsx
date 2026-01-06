import { Activity } from 'lucide-react'
import { MOCK_PATIENTS } from '../../data/mockData'
import { DoctorStatusBadge } from '../DoctorStatusBadge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const PatientsTable = () => {
  const attentionPatients = MOCK_PATIENTS.filter((p) =>
    ['critical', 'warning'].includes(p.health_status),
  )

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-3 md:p-5">
        <h2 className="flex items-center text-xs font-semibold text-red-800 md:text-base">
          <Activity className="mr-2 size-3 md:size-5" />
          Bệnh nhân cần chú ý
        </h2>
        <Badge className="bg-red-100 text-red-700">
          {attentionPatients.length}
        </Badge>
      </div>

      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-gray-100 hover:bg-gray-50">
            <TableHead className="text-gray-500">Bệnh nhân</TableHead>
            <TableHead className="text-gray-500">Tình trạng</TableHead>
            <TableHead className="text-center text-gray-500 md:text-left">
              Trạng thái
            </TableHead>
            <TableHead className="text-center text-gray-500 md:text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attentionPatients.map((p) => (
            <TableRow key={p.id} className="border-gray-50 hover:bg-gray-50">
              <TableCell className="py-3 font-medium text-gray-900">
                {p.full_name}
              </TableCell>
              <TableCell className="py-3 text-gray-600">
                {p.condition}
              </TableCell>
              <TableCell className="py-3 text-center md:text-left">
                <DoctorStatusBadge
                  status={p.health_status}
                  className="px-1 font-normal md:px-2 md:font-medium"
                />
              </TableCell>
              <TableCell className="py-3 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 border-teal-200 px-2 text-teal-600 hover:bg-teal-50 hover:text-teal-800 md:h-7 md:text-xs">
                  Kiểm tra
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
