import { Pill } from 'lucide-react'
import type { PrescriptionItem } from '@/features/patient/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PrescriptionTableSectionProps {
  prescription: Array<PrescriptionItem>
}

export const PrescriptionTableSection = ({
  prescription,
}: PrescriptionTableSectionProps) => {
  if (prescription.length === 0) return null

  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-teal-50/50 px-4 py-3">
        <Pill className="text-teal-primary size-5" strokeWidth="2.5" />
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          Đơn thuốc
        </h3>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead>Tên thuốc</TableHead>
              <TableHead>Liều lượng</TableHead>
              <TableHead className="hidden md:table-cell">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescription.map((item) => (
              <TableRow key={item.name} className="hover:bg-teal-50/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-primary size-2 shrink-0 rounded-full" />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="text-teal-primary">
                  {item.dosage}
                </TableCell>
                <TableCell className="hidden text-slate-600 md:table-cell">
                  {item.duration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
