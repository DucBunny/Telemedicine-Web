import {
  AlertTriangle,
  Database,
  Plus,
  RefreshCw,
  Server,
  Shield,
  Smartphone,
  Users,
} from 'lucide-react'
import { SYSTEM_STATS } from '../data/mockData'

export const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Tổng người dùng',
            value: SYSTEM_STATS.total_users,
            sub: `+${SYSTEM_STATS.active_doctors} Bác sĩ`,
            icon: Users,
            color: 'bg-blue-600',
          },
          {
            label: 'Thiết bị Online',
            value: SYSTEM_STATS.devices_online,
            sub: `Trên tổng số ${SYSTEM_STATS.total_devices}`,
            icon: Server,
            color: 'bg-green-600',
          },
          {
            label: 'Thiết bị bảo trì',
            value: SYSTEM_STATS.devices_maintenance,
            sub: 'Cần kiểm tra ngay',
            icon: Smartphone,
            color: 'bg-orange-500',
          },
          // THAY ĐỔI: Sử dụng "Cảnh báo chưa xử lý"
          {
            label: 'Cảnh báo chưa xử lý',
            value: SYSTEM_STATS.pending_alerts,
            sub: 'Cần bác sĩ hỗ trợ ngay',
            icon: AlertTriangle,
            color: 'bg-red-600',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="mt-1 text-xs text-gray-400">{stat.sub}</p>
            </div>
            <div className={`rounded-lg p-3 ${stat.color} bg-opacity-10`}>
              <stat.icon
                className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions Panel */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center font-semibold text-gray-800">
            <Shield className="mr-2 h-5 w-5 text-teal-600" /> Hành động nhanh
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 transition hover:border-teal-500 hover:bg-gray-50 hover:text-teal-600">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 group-hover:bg-teal-100">
                <Plus className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium">Thêm Bác sĩ</span>
            </button>
            <button className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 transition hover:border-blue-500 hover:bg-gray-50 hover:text-blue-600">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Đăng ký thiết bị</span>
            </button>
            <button className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 transition hover:border-orange-500 hover:bg-gray-50 hover:text-orange-600">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 group-hover:bg-orange-100">
                <RefreshCw className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Reset Cache</span>
            </button>
            <button className="group flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 transition hover:border-gray-500 hover:bg-gray-50 hover:text-gray-600">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200">
                <Database className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium">Backup Dữ liệu</span>
            </button>
          </div>
        </div>

        {/* System Logs (Mock) */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800">Nhật ký hệ thống</h3>
            <button className="text-xs text-teal-600 hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              {
                msg: 'Cảnh báo mới: Nhịp tim PAT-1002 cao',
                time: '10:30 AM',
                type: 'warning',
              },
              {
                msg: 'User ID 202 bị khóa do sai mật khẩu 5 lần',
                time: '09:15 AM',
                type: 'warning',
              },
              {
                msg: 'Backup hệ thống hoàn tất (Daily)',
                time: '02:00 AM',
                type: 'success',
              },
              {
                msg: 'Bác sĩ An cập nhật hồ sơ bệnh án #8821',
                time: 'Hôm qua',
                type: 'info',
              },
            ].map((log, i) => (
              <div key={i} className="flex items-start space-x-3 p-4 text-sm">
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    log.type === 'warning'
                      ? 'bg-orange-500'
                      : log.type === 'success'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                  }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">{log.msg}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
