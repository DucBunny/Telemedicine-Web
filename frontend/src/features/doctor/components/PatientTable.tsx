import { AlertTriangle, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  lastVisit: string
  diagnosis: string
  status: 'stable' | 'warning' | 'critical'
  bpm: number
  spo2: number
}

const patientsData: Array<Patient> = [
  {
    id: 'PT001',
    name: 'Nguyễn Văn A',
    age: 65,
    gender: 'Nam',
    lastVisit: '10:30 AM, Hôm nay',
    diagnosis: 'Rối loạn nhịp tim',
    status: 'critical',
    bpm: 110,
    spo2: 92,
  },
  {
    id: 'PT002',
    name: 'Trần Thị B',
    age: 54,
    gender: 'Nữ',
    lastVisit: '09:15 AM, Hôm qua',
    diagnosis: 'Cao huyết áp',
    status: 'warning',
    bpm: 140,
    spo2: 98,
  },
  {
    id: 'PT003',
    name: 'Lê Văn C',
    age: 72,
    gender: 'Nam',
    lastVisit: '08:00 AM, Hôm nay',
    diagnosis: 'Suy hô hấp nhẹ',
    status: 'stable',
    bpm: 78,
    spo2: 97,
  },
]

export const PatientTable = () => {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[250px]">Bệnh nhân</TableHead>
            <TableHead>Chẩn đoán</TableHead>
            <TableHead className="text-right">Chỉ số (BPM / SpO2)</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientsData.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-slate-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                      alt={patient.name}
                    />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-900">
                      {patient.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      ID: {patient.id} • {patient.age}T • {patient.gender}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-slate-700">
                  {patient.diagnosis}
                </div>
                <div className="text-muted-foreground text-xs">
                  {patient.lastVisit}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                <span
                  className={
                    patient.bpm > 100
                      ? 'font-bold text-rose-600'
                      : 'text-slate-700'
                  }>
                  {patient.bpm}
                </span>
                <span className="mx-1 text-slate-300">/</span>
                <span
                  className={
                    patient.spo2 < 95
                      ? 'font-bold text-rose-600'
                      : 'text-slate-700'
                  }>
                  {patient.spo2}%
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    patient.status === 'critical'
                      ? 'destructive'
                      : patient.status === 'warning'
                        ? 'secondary'
                        : 'outline'
                  }
                  className={
                    patient.status === 'warning'
                      ? 'border-orange-200 bg-orange-100 text-orange-700 hover:bg-orange-100'
                      : patient.status === 'stable'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : ''
                  }>
                  {patient.status === 'critical'
                    ? 'Nguy cấp'
                    : patient.status === 'warning'
                      ? 'Cảnh báo'
                      : 'Ổn định'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuItem>Xem hồ sơ chi tiết</DropdownMenuItem>
                    <DropdownMenuItem>Xem lịch sử đo</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-rose-600">
                      <AlertTriangle className="mr-2 h-4 w-4" /> Gọi khẩn cấp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
