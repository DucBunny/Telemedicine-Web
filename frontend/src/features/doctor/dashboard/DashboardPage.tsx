import {
  Activity,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Users,
} from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { PatientTable } from '../components/PatientTable'
import { Section } from './Section'
import { Button } from '@/components/ui/button'

export const DoctorDashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Section />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng bệnh nhân"
          value="1,284"
          icon={Users}
          trend={{ value: 12, label: 'so với tháng trước', direction: 'up' }}
        />
        <StatCard
          title="Cảnh báo nguy cấp"
          value="3"
          icon={AlertTriangle}
          className="border-rose-200 bg-rose-50/10"
          description="Cần xử lý ngay lập tức"
        />
        <StatCard
          title="Lịch khám hôm nay"
          value="12"
          icon={Calendar}
          description="4 ca buổi sáng, 8 ca buổi chiều"
        />
        <StatCard title="Tin nhắn mới" value="10" icon={MessageSquare} />
      </div>

      {/* Main Content Split */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Left: Patient List (5/7) */}
        <div className="col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Bệnh nhân cần chú ý
            </h3>
            <Button variant="link" className="h-auto p-0 text-teal-600">
              Xem tất cả
            </Button>
          </div>
          <PatientTable />
        </div>

        {/* Right: Widgets (2/7) */}
        <div className="col-span-2 space-y-6">
          <div className="bg-card relative overflow-hidden rounded-xl border bg-linear-to-br from-indigo-600 to-purple-700 p-5 text-white shadow-sm">
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"></div>
            <h3 className="relative z-10 mb-4 flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5" /> Hoạt động mới
            </h3>
            <div className="relative z-10 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/10 p-3 backdrop-blur-md">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-400" />
                <div>
                  <p className="text-sm font-medium">Kết quả xét nghiệm</p>
                  <p className="mt-0.5 text-xs opacity-80">
                    Lê Văn C vừa cập nhật huyết áp.
                  </p>
                </div>
                <span className="ml-auto text-[10px] whitespace-nowrap opacity-60">
                  2p
                </span>
              </div>
            </div>
            <Button className="mt-4 h-8 w-full bg-white text-xs font-semibold text-indigo-700 hover:bg-white/90">
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
