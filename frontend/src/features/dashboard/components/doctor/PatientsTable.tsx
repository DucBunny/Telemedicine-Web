import { Activity } from 'lucide-react'

import { MOCK_PATIENTS } from '@/features/doctor/data/mockData'
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

export const PatientsTable = () => {
  const attentionPatients = MOCK_PATIENTS.filter((p) =>
    ['critical', 'warning'].includes(p.currentHealthStatus),
  )

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-3 md:p-5">
        <h2 className="flex items-center text-xs font-semibold text-red-800 md:text-base">
          <Activity className="mr-2 size-3 md:size-5" />
          Bệnh nhân cần chú ý
        </h2>
        <Badge className="bg-red-100 text-red-700">
          {attentionPatients.length || 0}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-b-xl">
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
              <TableRow
                key={p.userId}
                className="border-gray-50 hover:bg-gray-50">
                <TableCell className="py-3 font-medium text-gray-900">
                  {p.user.fullName}
                </TableCell>
                <TableCell className="py-3 text-gray-600">
                  {p.currentHealthStatus === 'critical' ? (
                    <Badge className="bg-red-100 text-red-700">Nguy kịch</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      Cảnh báo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-3 text-center md:text-left"></TableCell>
                <TableCell className="py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-primary h-6 border-teal-200 px-2 hover:bg-teal-50 hover:text-teal-800 md:h-7 md:text-xs">
                    Kiểm tra
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
