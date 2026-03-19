import {
  ArrowRight,
  Ellipsis,
  EllipsisVertical,
  Eye,
  FileUser,
} from 'lucide-react'
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

export type ThemeColor =
  | 'blue'
  | 'indigo'
  | 'rose'
  | 'emerald'
  | 'amber'
  | 'purple'
  | 'cyan'
  | 'pink'

export interface Doctor {
  name: string
  role: string
  initials: string
  avatarTheme: ThemeColor
}

export interface MedicalRecord {
  id: string
  date: string
  time: string
  doctor: Doctor
  specialty: string
  specialtyTheme: ThemeColor
  diagnosis: string
}

export const MOCK_RECORDS: Array<MedicalRecord> = [
  {
    id: '1',
    date: '24/10/2023',
    time: '09:30 AM',
    doctor: {
      name: 'BS. Trần Minh',
      role: 'Trưởng khoa',
      initials: 'TM',
      avatarTheme: 'indigo',
    },
    specialty: 'Nội tổng quát',
    specialtyTheme: 'blue',
    diagnosis: 'Viêm họng cấp, sốt siêu vi. Kê đơn thuốc kháng sinh 5 ngày.',
  },
  {
    id: '2',
    date: '15/09/2023',
    time: '14:00 PM',
    doctor: {
      name: 'BS. Lê Anh',
      role: 'Phó khoa',
      initials: 'LA',
      avatarTheme: 'rose',
    },
    specialty: 'Tim mạch',
    specialtyTheme: 'rose',
    diagnosis: 'Kiểm tra định kỳ huyết áp. Huyết áp ổn định 120/80.',
  },
  {
    id: '3',
    date: '02/08/2023',
    time: '10:15 AM',
    doctor: {
      name: 'BS. Nguyễn Hùng',
      role: 'Bác sĩ chuyên khoa',
      initials: 'NH',
      avatarTheme: 'emerald',
    },
    specialty: 'Da liễu',
    specialtyTheme: 'emerald',
    diagnosis: 'Dị ứng thời tiết, mẩn đỏ vùng cánh tay.',
  },
  {
    id: '4',
    date: '20/05/2023',
    time: '08:00 AM',
    doctor: {
      name: 'BS. Phạm Văn',
      role: 'Bác sĩ tư vấn',
      initials: 'PV',
      avatarTheme: 'amber',
    },
    specialty: 'Tiêu hóa',
    specialtyTheme: 'amber',
    diagnosis: 'Rối loạn tiêu hóa nhẹ. Đề nghị chế độ ăn uống lành mạnh.',
  },
  {
    id: '5',
    date: '10/01/2023',
    time: '11:30 AM',
    doctor: {
      name: 'BS. Trần Hoa',
      role: 'Bác sĩ chuyên khoa',
      initials: 'TH',
      avatarTheme: 'purple',
    },
    specialty: 'Mắt',
    specialtyTheme: 'purple',
    diagnosis: 'Đo thị lực, cận thị 2 độ mắt trái.',
  },
  {
    id: '6',
    date: '05/12/2022',
    time: '09:00 AM',
    doctor: {
      name: 'BS. Đặng Văn',
      role: 'Chuyên gia',
      initials: 'DV',
      avatarTheme: 'cyan',
    },
    specialty: 'Răng hàm mặt',
    specialtyTheme: 'cyan',
    diagnosis: 'Nhổ răng khôn số 8, kê đơn giảm đau và kháng viêm.',
  },
  {
    id: '7',
    date: '28/11/2022',
    time: '15:30 PM',
    doctor: {
      name: 'BS. Hoàng Thị',
      role: 'Bác sĩ chuyên khoa',
      initials: 'HT',
      avatarTheme: 'pink',
    },
    specialty: 'Sản phụ khoa',
    specialtyTheme: 'pink',
    diagnosis: 'Khám phụ khoa định kỳ, kết quả bình thường.',
  },
]

interface MedicalRecordTableProps {
  records: Array<MedicalRecord>
  onViewDetail?: (id: string) => void
  currentPage?: number
  totalPages?: number
  totalItems?: number
  onPageChange?: (page: number) => void
}

// Map màu cho Avatar chữ
const avatarColors: Record<ThemeColor, string> = {
  indigo: 'bg-indigo-100 text-indigo-600',
  rose: 'bg-rose-100 text-rose-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  pink: 'bg-pink-100 text-pink-600',
  blue: 'bg-blue-100 text-blue-600',
}

// Map màu cho Badge chuyên khoa
const badgeColors: Record<ThemeColor, string> = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-100 dark:border-blue-800',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-100 dark:border-rose-800',
  emerald:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800',
  amber:
    'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-100 dark:border-amber-800',
  purple:
    'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-100 dark:border-purple-800',
  cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800',
  pink: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-100 dark:border-pink-800',
  indigo:
    'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800',
}

export const RecordTable = ({
  records,
  onViewDetail,
  currentPage = 1,
  totalPages = 2,
  totalItems = 0,
  onPageChange,
}: MedicalRecordTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table className="min-w-0 table-fixed">
        <TableHeader className="bg-teal-50">
          <TableRow className="border-gray-100 hover:bg-teal-50">
            <TableHead className="w-28">Ngày khám</TableHead>
            <TableHead>Bác sĩ</TableHead>
            <TableHead className="w-30">Chuyên khoa</TableHead>
            <TableHead>Chẩn đoán</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records && records.length > 0 ? (
            records.map((record) => (
              <TableRow
                key={record.id}
                className="border-gray-100 hover:bg-teal-50/50">
                {/* Cột Ngày & Giờ */}
                <TableCell>
                  <div className="font-medium">{record.date}</div>
                  <div className="text-xs text-slate-500">{record.time}</div>
                </TableCell>

                {/* Cột Bác sĩ */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        avatarColors[record.doctor.avatarTheme],
                      )}>
                      {record.doctor.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {record.doctor.name}
                      </div>
                      <div className="truncate text-xs text-slate-500">
                        {record.doctor.role}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Cột Chuyên khoa */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(badgeColors[record.specialtyTheme])}>
                    {record.specialty}
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
                    onClick={() => onViewDetail?.(record.id)}
                    className="text-teal-primary hover:text-teal-primary-foreground hover:bg-gray-100">
                    {/* Chi tiết
                    <ArrowRight className="size-4" /> */}
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
      {totalPages > 1 && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={records.length}
            onPageChange={onPageChange || (() => {})}
            showItemsInfo
          />
        </div>
      )}
    </div>
  )
}
